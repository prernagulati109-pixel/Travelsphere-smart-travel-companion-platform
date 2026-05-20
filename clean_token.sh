#!/bin/bash
if [ -f "Frontend/src/styles/hotels.css" ]; then
  sed -i 's/access_token=pk\.[^)"]*/access_token=PLACEHOLDER/g' "Frontend/src/styles/hotels.css"
fi
