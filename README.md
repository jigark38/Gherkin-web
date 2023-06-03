# Gherkin Angular 8 Application for Enterprise application

!Important: Pls update NPM  to install node modules.

Angular stack prototype for scalable Gherkin applications.

Implementation includes:

- Angular 8 (Full Release)
- Routes (v3)
- Services
- Models
- HTTP service call to JSON (needs further review)
- Components
- Directives
- BEM best practices - block, element, modify
- MongoDB (currently in feature/add-mongoDB)


To work on this project:

* Run `npm install` inside the project folder to download all the dependencies. This only needs to be done once.
* NOTE: Sometimes there will be typings related problems during installation. In such cases update `.typingsrc` file with the following contents before issuing npm install again.

To Run application in Local:
* Use `npm run serve` to run  application.

To create a production build:
* Use `npm run prod` to build application. Files will be created in `dist` folder.

Theme Support Implemented (010916):
Not applicable as of now

npm cache clean --force
npm cache verify
