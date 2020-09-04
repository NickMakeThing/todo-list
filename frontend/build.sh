#!/bin/bash

rm -r "../backend/todolist/templates/build"
npm run build
mv build "../backend/todolist/templates/build"
mv "../backend/todolist/templates/build/colour.png" "../backend/todolist/templates/build/static/colour.png"
mv "../backend/todolist/templates/build/delete.png" "../backend/todolist/templates/build/static/delete.png"
