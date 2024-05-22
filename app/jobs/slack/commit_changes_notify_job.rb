class Slack::CommitChangesNotifyJob < ApplicationJob
  queue_as :default
  sidekiq_options retry: 0

  def perform(*args)
    return if ENV["SLACK_WEBHOOK_URL"].blank?

    check_changes
    if @any_changes
      RestClient.post ENV["SLACK_WEBHOOK_URL"], payload_msg.to_json,
      { content_type: :json, accept: :json }
    end
  end

  private

    def check_changes
      upstream_commit_hash = `git ls-remote #{ENV["UPSTREAM_GIT_URL"]} refs/heads/main`.split("\t").first
      last_commit = UpstreamCommit.last

      tag_name = `git describe --tags #{upstream_commit_hash}`.strip

      if last_commit.nil? || (last_commit.commit_hash != upstream_commit_hash)
        UpstreamCommit.create!(commit_hash: upstream_commit_hash, branch: "main", tag_name:)
        @any_changes = true
      end
    rescue => e
      puts "Error: #{e.message}"
    end

    def version_change_description
      records = UpstreamCommit.last(2)
      return "" if records.empty? || records.first&.tag_name == records.second&.tag_name
      return " to #{records.first.tag_name}" if records.second.nil?
      return "" if records.second.tag_name.empty?

      " from #{records.first.tag_name} to #{records.second.tag_name}"
    end

    def last_commit_date
      full_date = `git show -s --format=%ci #{UpstreamCommit.last.commit_hash}`

      time = Time.parse(full_date)
      " at #{time.strftime("%H:%M, %d %b %Y")}"
    rescue => e
      puts "Error: #{e.message}"
    end

    def payload_msg
      {
        text: "New changes in upstream repository",
        blocks: [
          {
            type: "header",
            text: {
              type: "plain_text",
              text: "The upstream repository has some updates",
              emoji: true
            }
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "Upstream repository has been updated#{version_change_description}#{last_commit_date}. Please review the changes"
              }
            ]
          }
        ].compact
      }
    end
end

