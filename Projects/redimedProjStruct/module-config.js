/**
 * Created by meditech on 8/29/2014.
 */

//root
eval(fs.readFileSync('module_listener/root.js')+'');

//HelloWorld module
eval(fs.readFileSync('module_listener/helloWorld.js')+'');

//User
eval(fs.readFileSync('module_listener/users.js')+'');

