#!/bin/sh
ng serve --port 2100 &
gin --port 2101 --path . --build ./src/server/ --i --all &
wait