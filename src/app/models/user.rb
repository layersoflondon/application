class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_many :records, dependent: :nullify
  has_many :team_users
  has_many :teams, through: :team_users
  has_many :collections, as: :owner

  # TODO: - users should change the state of their records before being deleted.
  # before_destroy do
  #  records.each {|r| r.make_orphan! }
  # end
end
