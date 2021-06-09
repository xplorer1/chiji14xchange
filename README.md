# Project Title

This is a simple nodejs project. It supports the following actions:

- Get all blog posts
- Get blog posts with pagination
- Get post by id
- Create blog
- Update blog
- Delete blog
- Delete post
- Add comment to a blog post
- Get comment on a blog post
- Edit comment on a blog post
- Delete comment on a blog post

## Requirements

For development, you will only need Node.Js and a node global package, npm, installed in your environement.

### Installation

Just go on [official Node.js website](https://nodejs.org/) and download the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v12.11.3

    $ npm --version
    6.14.0

    These are the current versions at the time of creating this project.

# Getting this app running locally.

## Run Locally

To run this app, you must have a nodejs of atleast v10.x.

1.  Clone this repo:

        git clone https://github.com/xplorer1/chiji14xchange.git

1.  Change into the cloned app:

        cd chiji14xchange/

1.  Install depedencies:

        npm install

## Configure app

Open `./config.js` in the root path then edit it with your settings. You will need:

- A cloudinary credentials for image upload.;
- Database credentials;

1.  Run the sample with `node` or `nodemon` 

        node server.js

1.  Make requests to the application at [http://localhost:9000][].

1. API documentation is at https://documenter.getpostman.com/view/13616694/TzeRo9qh

[nodejs]: https://nodejs.org/