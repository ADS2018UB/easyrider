class StationsController < ApplicationController
  # before_action :set_station, only: [:show, :update, :destroy]
  before_action :set_station, only: [:show]
  before_action :set_date, only: [:show, :index]

  # sample time in minutes, i.e. every SAMPLE_TIME minutes there's a new state
  SAMPLE_TIME = 10
  MIN_DATE = Time.parse Station.first.states.min(:ts)
  MAX_DATE = Time.parse Station.first.states.max(:ts)

  # GET /stations
  def index
    @stations = Station.only(:station_id, :station_name, :address, :total_docks, :longitude, :latitude).all
    # todo: get current state for each station for given date parameter
    stations_json = Array.new

    states = State.where(ts: (@date - (SAMPLE_TIME / 2).minutes..@date + (SAMPLE_TIME / 2).minutes)).all.pluck(:station_id, :available_bikes).to_h

    @stations.each do |station|
      json = station.as_json
      json.delete('_id')
      json['current_bikes'] = states[station.station_id]
      # json['trend'] = get_trend(station)
      stations_json << json
    end
    render json: stations_json
  end

  # GET /stations/1
  def show
    json = @station.as_json
    json.delete('_id')
    json['current_bikes'] = get_available_bikes(@station)
    json['trend'] = get_trend(@station)
    render json: json
  end

  # # POST /stations
  # def create
  #   @station = Station.new(station_params)
  #
  #   if @station.save
  #     render json: @station, status: :created, location: @station
  #   else
  #     render json: @station.errors, status: :unprocessable_entity
  #   end
  # end
  #
  # # PATCH/PUT /stations/1
  # def update
  #   if @station.update(station_params)
  #     render json: @station
  #   else
  #     render json: @station.errors, status: :unprocessable_entity
  #   end
  # end
  #
  # # DELETE /stations/1
  # def destroy
  #   @station.destroy
  # end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_station
    @station = Station.find_by(station_id: params[:id])
  end

  def set_date
    begin
      @date = params[:date].nil? ? nil : (Time.parse params[:date])
    rescue ArgumentError
      raise ActionController::BadRequest.new, "Date parameter must be of form yyyy-mm-ddThh:mm" if @date.nil?
    end
    raise ActionController::BadRequest.new, "Date parameter must be set" if @date.nil?
    raise ActionController::BadRequest.new, "Invalid date (must be between #{MIN_DATE} and #{MAX_DATE})." unless @date.between?(MIN_DATE, MAX_DATE)
    @date
  end

  # Only allow a trusted parameter "white list" through.
  def station_params
    params.require(:station).permit(:name, :lat, :lng, :capacity)
  end

  def get_trend(station)
    # just do that manually here in ruby since it won't have to perform thaaat fast...
    states = station.states.where(ts: (@date.beginning_of_day..@date.end_of_day)).all.pluck(:available_bikes)
    trend = Array.new
    states.each_slice(6) do |a|
      trend << (a.inject(&:+) / 6).round(2)
    end
    trend
  end

  def get_available_bikes(station)
    r = station.states.where(ts: (@date - (SAMPLE_TIME / 2).minutes..@date + (SAMPLE_TIME / 2).minutes)).first
    return if r.nil?
    r.available_bikes
  end


end
