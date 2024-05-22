class UpstreamCommit < ApplicationRecord
  validates :commit_hash, presence: true
end
