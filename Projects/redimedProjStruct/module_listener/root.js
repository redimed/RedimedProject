/**
 * Created by meditech on 8/29/2014.
 */
app.get('/', function(req, res) {
    res.sendfile(path.join(clientDir, 'login.html'))
});

app.get('/home',auth,function(req,res){
    res.sendfile(path.join(clientDir, 'home.html'))
});



