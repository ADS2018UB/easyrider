require 'test_helper'

class StationsControllerTest < ActionDispatch::IntegrationTest

  test "get all stations without date should throw bad request" do
    assert_raises ActionController::BadRequest do
      get stations_url, as: :json
    end
  end

  test "get single station without date should throw bad request" do
    assert_raises ActionController::BadRequest do
      get station_url(2), as: :json
    end
  end

  test "get all stations with invalid date throws bad request" do
    assert_raises ActionController::BadRequest do
      get stations_url({date: 'invalid date'}), as: :json
    end
  end

  test "get single station with invalid date should throw bad request" do
    assert_raises ActionController::BadRequest do
      get station_url(2, {date: 'invalid date'}), as: :json
    end
  end

  test "get all stations with date out of range throws bad request" do
    assert_raises ActionController::BadRequest do
      get stations_url({date: '2019-01-01'}), as: :json
    end
  end

  test "get single station with date out of range should throw bad request" do
    assert_raises ActionController::BadRequest do
      get station_url(2, {date: '2018-01-01'}), as: :json
    end
  end

  test "get all stations returns all stations" do
    get stations_url({date: '2018-10-01'}), as: :json
    assert_response :success
    stations = JSON.parse response.body
    assert_equal 569, stations.count
  end

  test "get all stations returns correct data" do
    get stations_url({date: '2018-10-01'}), as: :json
    assert_response :success
    stations = JSON.parse response.body
    s = stations[0]
    assert_not_nil s['address']
    assert_not_nil s['latitude']
    assert_not_nil s['longitude']
    assert_not_nil s['station_id']
    assert_not_nil s['station_name']
    assert_not_nil s['total_docks']
    assert_not_nil s['current_bikes']
  end

  test "get single station returns correct data" do
    get station_url(2, {date: '2018-10-01'}), as: :json
    assert_response :success
    s = JSON.parse response.body
    assert_not_nil s['address']
    assert_not_nil s['latitude']
    assert_not_nil s['longitude']
    assert_not_nil s['station_id']
    assert_not_nil s['station_name']
    assert_not_nil s['total_docks']
    assert_not_nil s['current_bikes']
    assert_not_nil s['trend']
    assert_equal 24, s['trend'].count
  end

end
