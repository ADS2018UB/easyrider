class CreateStates < ActiveRecord::Migration[5.2]
  def change
    create_table :states do |t|
      t.integer :state
      t.datetime :timestamp
      t.references :station, foreign_key: true

      t.timestamps
    end
  end
end
