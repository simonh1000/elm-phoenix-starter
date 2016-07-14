module App exposing (init, update, view)

import Html exposing (..)
import Html.Attributes exposing (class)
import Http
import Json.Decode as Json exposing ( (:=) )

import Task

-- CONSTANTS

serverUrl = "http://localhost:4000/api/default"

-- MODEL

type alias Model = String

init : (Model, Cmd Msg)
init = ("Loading...", loadData)

-- UPDATE

type Msg
    = FetchSucceed String
    | FetchFail Http.Error

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
    case msg of
        FetchSucceed str ->
            (str, Cmd.none)
        FetchFail err ->
            (toString err, Cmd.none)

-- VIEW

view : Model -> Html Msg
view model =
    div [ class "container" ]
        [ h1 []
            [ text model ]
        ]

-- TASKS
loadData : Cmd Msg
loadData =
    Http.get ("data" := Json.string) serverUrl
    |> Task.perform FetchFail FetchSucceed
