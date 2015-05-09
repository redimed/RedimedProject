/**
 * Created by meditech on 9/27/2014.
 */
var medifoodController=require('./controllers/medifoodController');

app.get('/api/medifood/create-session',medifoodController.createSession);
app.get('/api/medifood/get-list-food',medifoodController.getListFood);
app.post('/api/medifood/add-item-to-cart',medifoodController.addItemToCart);
app.post('/api/medifood/get-chosen-foods',medifoodController.getChosenFoods);
app.post('/api/medifood/cancel-item',medifoodController.cancelItem);
app.post('/api/medifood/get-all-booking-of-session',medifoodController.getAllBookingOfSession);
app.post('/api/medifood/change-session-status',medifoodController.changeSessionStatus);

//rlType
// app.get('/api/rlob/rl_types/list',rlTypesController.list);
// app.get('/api/rlob/rl_types/get-rltype-by-id',rlTypesController.getRlTypeById);
// app.get('/api/rlob/rl_types/get-list-rltype',rlTypesController.getListRlTpyes);
// app.post('/api/rlob/rl_types/update-rltype',rlTypesController.updateRlTypes);
// app.post('/api/rlob/rl_types/insert-rltype',rlTypesController.insertRlTypes);
