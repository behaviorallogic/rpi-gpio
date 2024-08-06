Raspberry Pi GPIO Utility
=========================

This utility uses Web sockets to send a signal to a Raspberry Pi over a network to simply turn on or off voltage to GPIO pins. I find it useful for separating the testing of hardware from software.

## Installation

This application was intended as a first use of git for beginners, so I am going to attempt to be more detailed and explicit than I would normally.

Clone this repo

    git clone git@github.com:behaviorallogic/rpi-gpio.git

or

    git clone https://github.com/behaviorallogic/rpi-gpio.git

Change the directory to the repo `cd rpi-gpio` and then install the required libraries `npm install`.

If you haven't install the pigpio library yet, you should do that now:

    sudo apt-get update
    sudo apt-get install pigpio

Do you have Node.js installed? This comes standard on the latest versions of Raspberry Pi OS, but if you have an older version, I'd recommend using [n to install and manage your Node.js versioning](https://github.com/tj/n).

    curl -L https://bit.ly/n-install | bash

You should have everything you need to run this now.

    npm start

I included a function to take a godo guess what the correct URL is. It might look something like `http://0.0.0.0:3792`. Paste that into any web browser's location bar on your local network to expose the user interface (UI)
