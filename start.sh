gnome-terminal --tab -e 'bash -c "cd ./frontend; npm start"'
. ./env/bin/activate
gnome-terminal --tab -e 'bash -c " python ./backend/manage.py runserver"'

