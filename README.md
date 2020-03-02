# Image Tracking (NFT) MARKER CREATOR

This editor creates Image Tracking (NFT) markers for ARTOOLKIT 5.x.
This can be used for AR.js and jsartoolkit5.

It take an image as input and outputs three files, called image descriptors, that can be loaded on the Web App for Image Tracking, using AR.js (or jsartoolkit5).

A Node version (preferred) and Web version are provided.

Check out the following tutorial to learn how to generate good markers!
https://github.com/Carnaux/NFT-Marker-Creator/wiki/Creating-good-markers

# Web version

**Online version, ready to use: https://ar-js-org.github.io/NFT-Marker-Creator/**

This version is less efficient for images with width and/or height with 1000px or higher.


## Instructions

1. Upload any JPG/PNG image.
2. If the Number of Channels is missing, it will as for it.
3. Click the generate button.
4. The files will be automatically downloaded when the generation finishes.

Advanced options coming soon.

## Node version (preferred version)

### How to use it

1. Clone this repository.

2. Install all dependencies.

    ` npm install `


3. Put the image you want inside the app folder. You can just paste it or you can create a folder. e.g

     - markerCreatorAppFolder
         - app.js
         - NftMarkerCreator.min.js
         - IMAGE.PNG
         - ...

     or

     - markerCreatorAppFolder
          - app.js
          - NftMarkerCreator.min.js
          - FOLDER/IMAGE.PNG
          - ...

4. Run it

    ` node app.js -i <PATH/TO/IMAGE>`

5. The prompt may ask you to insert information abou the image (width in px, height in px, DPI). It's strongly suggested to insert them.

6. In the end of the process an "output" folder will be created (if it does not exist) with the image-descriptors files.

You can use additional flags with the run command.

e.g node app.js -i image.png -level=4 -min_thresh=8

    -level=n
         (n is an integer in range 0 (few) to 4 (many). Default 2.'
    -sd_thresh=<sd_thresh>
    -max_thresh=<max_thresh>
    -min_thresh=<min_thresh>
    -leveli=n
         (n is an integer in range 0 (few) to 3 (many). Default 1.'
    -feature_density=<feature_density>
    -dpi=f: Override embedded JPEG DPI value.
    -max_dpi=<max_dpi>
    -min_dpi=<min_dpi>
    -background
         Run in background, i.e. as daemon detached from controlling terminal. (macOS and Linux only.)
    -log=<path>
    -loglevel=x
         x is one of: DEBUG, INFO, WARN, ERROR. Default is INFO.
    -exitcode=<path>
    --help -h -?  Display this help


5. The generated files will be on the "output" folder.

------
#### If you want to generate you own NftMarkerCreator.min.js use the dev branch.


"Icon made by Freepik from www.flaticon.com"
