/**
 * Created by meditech on 8/29/2014.
 */
var rl_types=require('./routes/rl_types');
var cln_specialties=require('./routes/cln_specialties');
//-------------------------------------------------------------
app.get('/api/rl_types/list',rl_types.list);
app.get('/api/cln_specialties/list',cln_specialties.list);