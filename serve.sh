#!/bin/sh
ng serve --port 2200 &
gin --port 2201 --path . --build ./src/server/ --i --all &
wait