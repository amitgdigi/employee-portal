class CreateUpstreamCommits < ActiveRecord::Migration[7.1]
  def change
    create_table :upstream_commits do |t|
      t.string :commit_hash
      t.string :branch
      t.string :tag_name

      t.timestamps
    end
  end
end
