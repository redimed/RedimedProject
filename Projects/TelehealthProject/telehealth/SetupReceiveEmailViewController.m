//
//  SetupReceiveEmailViewController.m
//  telehealth
//
//  Created by Hung Cao Thanh on 11/17/14.
//  Copyright (c) 2014 REDiMED. All rights reserved.
//

#import "SetupReceiveEmailViewController.h"
#import "rteleAppDelegate.h"
#import "SBJson.h"
#import "rteleWebserviceManager.h"
#import "MBProgressHUD.h"
#import "constants.h"

@interface SetupReceiveEmailViewController ()<UITableViewDataSource, UITableViewDelegate, UISearchBarDelegate, UIAlertViewDelegate, UITextFieldDelegate>{
    NSMutableArray *arrPeopleToReceive;
    NSMutableArray *arrPeopleSearched;
    BOOL isSearching;
    
    //UITableView *tableView
    UITableView *mainTableView;
    UISearchBar *searchBar;
    
    NSInteger currentIndexClicked;
    
    //insert form
    UITextField *familyTextfield;
    UITextField *giveNameTextfield;
    UITextField *telephoneTextfield;
    UITextField *nameEmail;
    UITextField *addressEmail;

    //Button
    UIButton *patient_button;
    UIButton *report_email_button;
    
    UITextField *activeField;
    BOOL isNew;
}

@end

@implementation SetupReceiveEmailViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    activeField = nil;
    [self.view setBackgroundColor:[UIColor colorWithRed:200/255.0 green:200/255.0 blue:205/255.0 alpha:1]];
    
    UIBarButtonItem *addBarButton = [[UIBarButtonItem alloc] initWithImage:[UIImage imageNamed:@"add"] style:UIBarButtonItemStylePlain target:self action:@selector(addEmailButtonClicked)];
    [addBarButton setImageInsets:UIEdgeInsetsMake(5, 5, 5, 5)];
    [self.navigationItem setRightBarButtonItem:addBarButton];
    currentIndexClicked = -1;
    // Do any additional setup after loading the view.
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [self setupView];
    //Load data
    dispatch_queue_t myQueue = dispatch_queue_create("hungcao.loadEmail", 0);
    dispatch_async(myQueue, ^{
        
        NSString *retVal = [rteleWebserviceManager sendSynchronousWebserviceRequest:@"api/getAllEmailReport"];
        SBJsonParser *jsonParser = [[SBJsonParser alloc] init];
        if (retVal != nil) {
            arrPeopleToReceive = [jsonParser objectWithString:retVal];
            dispatch_async(dispatch_get_main_queue(), ^{
                [mainTableView reloadData];
                [delegate hideActivityViewer];
            });
        }
        else{
            [delegate hideActivityViewer];
        }
    });
    //End
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name:UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidHide:) name:UIKeyboardDidHideNotification object:nil];
    
}

-(void) dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardDidShowNotification object:nil];
}

#pragma mark - setupview
-(void) setupView{
    NSLog(@"%@",NSStringFromCGRect(self.view.frame));
    arrPeopleToReceive = [[NSMutableArray alloc] init];
    
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
        searchBar = [[UISearchBar alloc ] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, 50)];
        [searchBar setDelegate:self];
        [self.view addSubview:searchBar];
        
        mainTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, searchBar.frame.size.height, self.view.frame.size.width, self.view.frame.size.height - searchBar.frame.size.height) style:UITableViewStyleGrouped];
    }else{
        searchBar = [[UISearchBar alloc ] initWithFrame:CGRectMake(0, 0, self.view.frame.size.height, 50)];
        [searchBar setDelegate:self];
        [self.view addSubview:searchBar];
        
        mainTableView = [[UITableView alloc] initWithFrame:CGRectMake(0, searchBar.frame.size.height, self.view.frame.size.height, self.view.frame.size.height - searchBar.frame.size.height) style:UITableViewStyleGrouped];
    }
    
    [mainTableView setDataSource:self];
    [mainTableView setDelegate:self];
    [mainTableView setTableFooterView:[[UIView alloc] initWithFrame:CGRectZero]];
    [self.view addSubview:mainTableView];
}

#pragma mark - UITableViewDatasource

-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}

-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    if (isSearching) {
        return arrPeopleSearched.count;
    }
    return arrPeopleToReceive.count;
}
-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 50.0;
}
-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *cellIdentifier = @"cellIdentifier";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:cellIdentifier];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleSubtitle reuseIdentifier:cellIdentifier];

        [cell setSelectionStyle:UITableViewCellSelectionStyleNone];
    }
    NSDictionary *dict = nil;
    if (isSearching) {
        dict = [arrPeopleSearched objectAtIndex:indexPath.row];
    }else{
        dict = [arrPeopleToReceive objectAtIndex:indexPath.row];
    }
    NSString *givenName = [dict valueForKey:@"given_name"];
    NSString *familyName = [dict valueForKey:@"family_name"];
    if (givenName.length == 0) {
        givenName = @"";
    }
    if (familyName.length == 0) {
        familyName = @"";
    }
    [cell.textLabel setText:[NSString stringWithFormat:@"%@ - %@",familyName,givenName]];
    [cell.detailTextLabel setText:[dict valueForKey:@"email"]];
    if ([[dict valueForKey:@"is_enable"] integerValue]) {
        [cell setAccessoryView:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"checkIcon"]]];
    }else{
        [cell setAccessoryView:nil];
    }
    return cell;
}
#pragma mark - UITableViewDelegate
-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    currentIndexClicked = indexPath.row;
    if (isSearching) {
        [searchBar resignFirstResponder];
    }
    isNew = FALSE;
    /*
    UIButton *backgroundButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [backgroundButton setFrame:self.view.bounds];
    [backgroundButton addTarget:self action:@selector(backgroundButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
    [backgroundButton setBackgroundColor:[UIColor colorWithRed:192/255.0 green:192/255.0 blue:192/255.0 alpha:0.7]];
    [self.view addSubview:backgroundButton];
    
    UIView *editView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 500, 300)];
    [editView setBackgroundColor:[UIColor whiteColor]];
    editView.layer.cornerRadius = 5;
    editView.center = CGPointMake(backgroundButton.frame.size.width/2, backgroundButton.frame.size.height/2);
    [backgroundButton addSubview:editView];
    
    UILabel *editLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, editView.frame.size.width, 50)];
    [editLabel setText:@"EDIT"];
    [editLabel setTextAlignment:NSTextAlignmentCenter];
    [editLabel setFont:[UIFont systemFontOfSize:20.0f]];
    [editLabel setBackgroundColor:[UIColor colorWithRed:166/255.0 green:151/255.0 blue:102.0/255.0 alpha:1.0]];
    [editView addSubview:editLabel];
    
    UILabel *name = [[UILabel alloc] initWithFrame:CGRectMake(20, editLabel.frame.size.height + 20, 160, 50)];
    [name setText:@"Your Email Address:"];
    [editView addSubview:name];
    
    emailTextfield = [[UITextField alloc] initWithFrame:CGRectMake(name.frame.size.width + name.frame.origin.x + 20, name.frame.origin.y, editView.frame.size.width - name.frame.origin.x - name.frame.size.width - 40, name.frame.size.height)];
    emailTextfield.layer.cornerRadius = 5;
    emailTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    emailTextfield.layer.borderWidth = 1.0;
    [emailTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 20, emailTextfield.frame.size.height)]];
    [emailTextfield setLeftViewMode:UITextFieldViewModeAlways];
    [editView addSubview:emailTextfield];
    NSMutableDictionary *dict = nil;
    if (isSearching) {
        dict = [arrPeopleSearched objectAtIndex:indexPath.row];
    }else{
        dict = [arrPeopleToReceive objectAtIndex:indexPath.row];
    }
    [emailTextfield setText:[dict valueForKey:@"email"]];
    
    UIButton *updateEmail = [UIButton buttonWithType:UIButtonTypeCustom];
    [updateEmail setTitle:@"Update" forState:UIControlStateNormal];
    [updateEmail setFrame:CGRectMake(20, editView.frame.size.height - 70, 100, 50)];
    [updateEmail addTarget:self action:@selector(updateEmailClicked:) forControlEvents:UIControlEventTouchUpInside];
    updateEmail.layer.cornerRadius = 5;
    updateEmail.layer.borderWidth = 1;
    [updateEmail setTag:1];
    updateEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    [updateEmail setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [editView addSubview:updateEmail];
    
    UIButton *disableEmail = [UIButton buttonWithType:UIButtonTypeCustom];
    if ([[dict valueForKey:@"is_enable"] integerValue]) {
        [disableEmail setTitle:@"Disable" forState:UIControlStateNormal];
    }else{
        [disableEmail setTitle:@"Enable" forState:UIControlStateNormal];
    }
    
    [disableEmail setFrame:CGRectMake(editView.frame.size.width - 120, editView.frame.size.height - 70, 100, 50)];
    [disableEmail addTarget:self action:@selector(updateEmailClicked:) forControlEvents:UIControlEventTouchUpInside];
    disableEmail.layer.cornerRadius = 5;
    disableEmail.layer.borderWidth = 1;
    [disableEmail setTag:2];
    disableEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    [disableEmail setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [editView addSubview:disableEmail];
    */
    NSMutableDictionary *dict = [arrPeopleToReceive objectAtIndex:indexPath.row];
    [self setupCreateEmailView:dict];
}


-(void) addEmailButtonClicked{
    [searchBar resignFirstResponder];
    isSearching = FALSE;
    isNew = YES;
    [self setupCreateEmailView:nil];
//    if ([self NSStringIsValidEmail:searchBar.text]) {
//        NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:searchBar.text,@"email",[NSNumber numberWithInt:1],@"is_enable",[NSNumber numberWithInt:0],@"id", nil];
//        [arrPeopleToReceive addObject:dict];
//        
//        //insert to table
//        [mainTableView beginUpdates];
//        NSArray *arr = [NSArray arrayWithObjects:[NSIndexPath indexPathForItem:arrPeopleToReceive.count - 1 inSection:0], nil];
//        [mainTableView insertRowsAtIndexPaths:arr withRowAnimation:UITableViewRowAnimationBottom];
//        [mainTableView endUpdates];
//        //
//        //Send to server
//        dispatch_queue_t myQueue = dispatch_queue_create("hungcao.insert", 0);
//        dispatch_async(myQueue, ^{
//            NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:searchBar.text,@"email",[NSNumber numberWithInt:1],@"is_enable",[NSNumber numberWithInt:0],@"member_id", nil];
//            NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/insertEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
//            if (![retVal isEqualToString:@"0"]) { //sucess
//                [dict setValue:retVal forKey:@"id"];
//                [arrPeopleToReceive replaceObjectAtIndex:(arrPeopleToReceive.count - 1) withObject:dict];
//                searchBar.text = @"";
//            }else{ //Failed
//                [arrPeopleToReceive removeLastObject];
//                [mainTableView beginUpdates];
//                NSArray *arr = [NSArray arrayWithObjects:[NSIndexPath indexPathForItem:arrPeopleToReceive.count - 1 inSection:0], nil];
//                [mainTableView deleteRowsAtIndexPaths:arr withRowAnimation:UITableViewRowAnimationBottom];
//                [mainTableView endUpdates];
//            }
//        });
//        //End
//    }else{
//        [[[UIAlertView alloc] initWithTitle:@"Error" message:@"Your email is invalid.\nPlease check it again!." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//    }
}

-(BOOL) NSStringIsValidEmail:(NSString *)checkString
{
    BOOL stricterFilter = NO;
    NSString *stricterFilterString = @"[A-Z0-9a-z\\._%+-]+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2,4}";
    NSString *laxString = @".+@([A-Za-z0-9-]+\\.)+[A-Za-z]{2}[A-Za-z]*";
    NSString *emailRegex = stricterFilter ? stricterFilterString : laxString;
    NSPredicate *emailTest = [NSPredicate predicateWithFormat:@"SELF MATCHES %@", emailRegex];
    return [emailTest evaluateWithObject:checkString];
}

#pragma mark - UIAlertViewDelegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{

}
#pragma mark -SearchBar
- (void)searchBar:(UISearchBar *)searchBar1 textDidChange:(NSString *)searchText{
    if (searchBar.text.length > 0 ) {
        isSearching = YES;
        if (!arrPeopleSearched) {
            arrPeopleSearched = [[NSMutableArray alloc] init];
        }else{
            [arrPeopleSearched removeAllObjects];
        }
        BOOL isContain = FALSE;
        for (NSDictionary *dict in arrPeopleToReceive) {
            if ([[[dict valueForKey:@"email"] lowercaseString] rangeOfString:[searchText lowercaseString]].location != NSNotFound) {
                [arrPeopleSearched addObject:dict];
                isContain = YES;
            }
        }
        if (!isContain) {
            isSearching = FALSE; //New
        }
    }else{
        isSearching = FALSE;
    }
    
    //ReloadTableView
    [mainTableView reloadData];
}

-(void)searchBarTextDidEndEditing:(UISearchBar *)searchBar{
    NSLog(@"");
}

//-(void) updateEmailClicked:(UIButton *) button{
//    NSMutableDictionary *dict = nil;
//    if (isSearching) {
//        dict = [arrPeopleSearched objectAtIndex:currentIndexClicked];
//    }else{
//        dict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
//    }
//    UITableViewCell *cell = [mainTableView cellForRowAtIndexPath:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0]];
//    if (button.tag == 1) { //update
//        
//        if ([self NSStringIsValidEmail:emailTextfield.text]) {
//            [cell.textLabel setText:emailTextfield.text];
//            [dict setValue:emailTextfield.text forKey:@"email"];
//            if (isSearching) {
//                [arrPeopleSearched replaceObjectAtIndex:currentIndexClicked withObject:dict];
//
//            }else{
//                [arrPeopleToReceive replaceObjectAtIndex:currentIndexClicked withObject:dict];
//            }
//            
//            [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
//            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
//                if (emailTextfield.text.length > 0) {
//                    
//                    NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/updateEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
//                    if ([retVal isEqualToString:@"1"]) { //sucess
//                        
//                    }else{ //sucess
//                        NSDictionary *getdict = nil;
//                        if (isSearching) {
//                            getdict = [arrPeopleSearched objectAtIndex:currentIndexClicked];
//                        }else{
//                            getdict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
//                        }
//                        [cell.textLabel setText:[getdict valueForKey:@"email"]];
//                    }
//                }
//                
//                // Do something...
//                [MBProgressHUD hideHUDForView:self.view animated:YES];
//            });
//        }
//
//    }else{ //disable | enable
//        
//        if ([[dict valueForKey:@"is_enable"] integerValue] == 0) { //Enable
//            [dict setValue:[NSNumber numberWithInt:1] forKey:@"is_enable"];
//            [cell setAccessoryView:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"checkIcon"]]];
//        }else{ //Disable
//            [dict setValue:[NSNumber numberWithInt:0] forKey:@"is_enable"];
//            [cell setAccessoryView:nil];
//        }
//        if (isSearching) {
//            [arrPeopleSearched replaceObjectAtIndex:currentIndexClicked withObject:dict];
//        }else{
//            [arrPeopleToReceive replaceObjectAtIndex:currentIndexClicked withObject:dict];
//        }
//        
//        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
//        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
//        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
//            NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/updateEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
//            if ([retVal isEqualToString:@"1"]) { //Success
//                
//            }else{ //Failed
//                NSDictionary *getdict = nil;
//                if (isSearching) {
//                    getdict = [arrPeopleSearched objectAtIndex:currentIndexClicked];
//                }else{
//                    getdict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
//                }
//                if ([[getdict valueForKey:@"is_enable"] integerValue]) {
//                    [cell setAccessoryView:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"checkIcon"]]];
//                }else{
//                    [cell setAccessoryView:nil];
//                }
//            }
//            // Do something...
//            [MBProgressHUD hideHUDForView:self.view animated:YES];
//        });
//    }
//
//    [button.superview.superview removeFromSuperview];
//    isSearching = FALSE;
//}
/*
-(void) setupCreateEmailView:(NSMutableDictionary *) dict{
    UIButton *backgroundButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [backgroundButton setFrame:self.view.bounds];
    [backgroundButton setBackgroundColor:[UIColor colorWithRed:192/255.0 green:192/255.0 blue:192/255.0 alpha:0.7]];
    [self.view addSubview:backgroundButton];
    
    //
    UIView *view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 500, 600)];
    [view setBackgroundColor:[UIColor whiteColor]];
    [view setClipsToBounds:YES];
    view.layer.cornerRadius = 5;
    view.center = CGPointMake(backgroundButton.frame.size.width/2, backgroundButton.frame.size.height/2);
    [backgroundButton addSubview:view];
    
    //Title
    UILabel *editLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, view.frame.size.width, 50)];
    [editLabel setText:@"INFO VIEW"];
    [editLabel setTextColor:[UIColor whiteColor]];
    [editLabel setTextAlignment:NSTextAlignmentCenter];
    [editLabel setFont:[UIFont systemFontOfSize:20.0f]];
    [editLabel setBackgroundColor:[UIColor colorWithRed:166/255.0 green:151/255.0 blue:102.0/255.0 alpha:1.0]];
    [view addSubview:editLabel];
    
    UIButton *createButton = nil;
    if (isNew) {
        //Button
        createButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [createButton setTitle:@"Create" forState:UIControlStateNormal];
//        [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 20, (view.frame.size.width -100)/2, 50)];
        [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 20, view.frame.size.width - 40, 50)];
        
        [createButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [createButton setTag:1];
        [createButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        createButton.layer.cornerRadius = 5;
        createButton.layer.borderColor = [[UIColor blackColor] CGColor];
        createButton.layer.borderWidth =  1.0;
        [createButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [createButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:createButton];
    }
    
    
    if (!isNew) {
        createButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [createButton setTitle:@"Update" forState:UIControlStateNormal];
//        [updateButton setFrame:CGRectMake(view.frame.size.width -20 - createButton.frame.size.width, editLabel.frame.size.height + 20, (view.frame.size.width -100)/2, 50)];
        [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 20, view.frame.size.width - 40, 50)];
        [createButton setTag:2];
        [createButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [createButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        createButton.layer.cornerRadius = 5;
        createButton.layer.borderColor = [[UIColor blackColor] CGColor];
        createButton.layer.borderWidth =  1.0;
        [createButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [createButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:createButton];
        
        //delete
//        UIButton *deleteButton = [UIButton buttonWithType:UIButtonTypeCustom];
//        [deleteButton setTitle:@"Delete" forState:UIControlStateNormal];
//        [deleteButton setFrame:CGRectMake(updateButton.frame.size.width + updateButton.frame.origin.x + 30, editLabel.frame.size.height + 20, (view.frame.size.width -100)/3, 50)];
//        [deleteButton setTag:3];
//        [deleteButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
//        [deleteButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
//        deleteButton.layer.cornerRadius = 5;
//        deleteButton.layer.borderColor = [[UIColor blackColor] CGColor];
//        deleteButton.layer.borderWidth =  1.0;
//        [deleteButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
//        [deleteButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
//        [view addSubview:deleteButton];

    }
    
    //Info
    //Family name
    UILabel *familyNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, createButton.frame.size.height + createButton.frame.origin.y + 30, 120, 50)];
    [familyNameLabel setText:@"Family Name*:"];
    [view addSubview:familyNameLabel];
    
    familyTextfield = [[UITextField alloc] initWithFrame:CGRectMake(familyNameLabel.frame.origin.x + familyNameLabel.frame.size.width + 20, familyNameLabel.frame.origin.y, view.frame.size.width - 60 - familyNameLabel.frame.size.width, 50)];
    familyTextfield.layer.borderWidth = 1.0;
    familyTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    familyTextfield.layer.cornerRadius = 5.0;
    [familyTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, familyTextfield.frame.size.height)]];
    [familyTextfield setLeftViewMode:UITextFieldViewModeAlways];
    [familyTextfield setClipsToBounds:YES];
    if (dict) {
        [familyTextfield setText:[dict valueForKey:@"family_name"]];
    }
    [view addSubview:familyTextfield];
    
    //Given name
    UILabel *givenNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, familyNameLabel.frame.size.height + familyNameLabel.frame.origin.y + 10, familyNameLabel.frame.size.width, familyNameLabel.frame.size.height)];
    [givenNameLabel setText:@"Given Name*:"];
    [view addSubview:givenNameLabel];
    
    giveNameTextfield = [[UITextField alloc] initWithFrame:CGRectMake(givenNameLabel.frame.size.width + 20 + givenNameLabel.frame.origin.x, givenNameLabel.frame.origin.y, familyTextfield.frame.size.width, familyTextfield.frame.size.height)];
    giveNameTextfield.layer.cornerRadius = 5;
    giveNameTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    giveNameTextfield.layer.borderWidth = 1.0;
    [giveNameTextfield setClipsToBounds:YES];
    [giveNameTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, giveNameTextfield.frame.size.height)]];
    [giveNameTextfield setLeftViewMode:UITextFieldViewModeAlways];
    if (dict != nil) {
        [giveNameTextfield setText:[dict valueForKey:@"given_name"]];
    }
    [view addSubview:giveNameTextfield];
    
    //telephone
    UILabel *telephoneLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, givenNameLabel.frame.size.height + givenNameLabel.frame.origin.y + 10, givenNameLabel.frame.size.width, givenNameLabel.frame.size.height)];
    [telephoneLabel setText:@"Telephone*:"];
    [view addSubview:telephoneLabel];
    
    telephoneTextfield = [[UITextField alloc] initWithFrame:CGRectMake(telephoneLabel.frame.size.width + telephoneLabel.frame.origin.x + 20, telephoneLabel.frame.origin.y, giveNameTextfield.frame.size.width, giveNameTextfield.frame.size.height)];
    telephoneTextfield.layer.cornerRadius = 5;
    telephoneTextfield.layer.borderWidth = 1.0;
    telephoneTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    [telephoneTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, telephoneTextfield.frame.size.height)]];
    [telephoneTextfield setLeftViewMode:UITextFieldViewModeAlways];
    [telephoneTextfield setClipsToBounds:YES];
    [telephoneTextfield setDelegate:self];
    if (dict) {
        [telephoneTextfield setText:[dict valueForKey:@"telephone"]];
    }
    [view addSubview:telephoneTextfield];
    
    UILabel *distributeLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, telephoneLabel.frame.size.height + 20 + telephoneLabel.frame.origin.y , 150, telephoneLabel.frame.size.height)];
    [distributeLabel setText:@"Distribution Email*"];
    [view addSubview:distributeLabel];
    
    nameEmail = [[UITextField alloc] initWithFrame:CGRectMake(20, distributeLabel.frame.size.height + 10 + distributeLabel.frame.origin.y, (view.frame.size.width - 40 - 30 )*2/3, 50)];
    nameEmail.layer.borderWidth = 1.0;
    nameEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    [nameEmail setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, nameEmail.frame.size.height)]];
    [nameEmail setDelegate:self];
    [nameEmail setLeftViewMode:UITextFieldViewModeAlways];
    [view addSubview:nameEmail];
    UILabel *acongLabel = [[UILabel alloc] initWithFrame:CGRectMake(nameEmail.frame.size.width + nameEmail.frame.origin.x, nameEmail.frame.origin.y, 30, nameEmail.frame.size.height)];
    [acongLabel setTextAlignment:NSTextAlignmentCenter];
    [acongLabel setText:@"@"];
    [view addSubview:acongLabel];
    addressEmail = [[UITextField alloc] initWithFrame:CGRectMake(acongLabel.frame.size.width + acongLabel.frame.origin.x, acongLabel.frame.origin.y, (view.frame.size.width - 40 - 30 )/3, acongLabel.frame.size.height)];
    [addressEmail setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, addressEmail.frame.size.height)]];
    [addressEmail setLeftViewMode:UITextFieldViewModeAlways];
    addressEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    addressEmail.layer.borderWidth = 1.0;
    [addressEmail setDelegate:self];
    if (dict) {
        NSArray *arr = [[dict valueForKey:@"email"] componentsSeparatedByString:@"@"];
        [nameEmail setText:[arr objectAtIndex:0]];
        [addressEmail setText:[arr objectAtIndex:1]];
    }
    [view addSubview:addressEmail];
    
    
    //Save and Cancel button
    UIButton *cancelButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [cancelButton setFrame:CGRectMake(view.frame.size.width - 120, view.frame.size.height - 70, 100, 50)];
    [cancelButton setTitle:@"Cancel" forState:UIControlStateNormal];
    [cancelButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];;
    [cancelButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [cancelButton setTag:4];
    cancelButton.layer.cornerRadius = 5;
    cancelButton.layer.borderColor = [[UIColor blackColor] CGColor];
    cancelButton.layer.borderWidth = 1.0;
    [cancelButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
    [cancelButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
    [view addSubview:cancelButton];
    if (!isNew) {
        UIButton *enableButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [enableButton setFrame:CGRectMake(view.frame.size.width - 240, cancelButton.frame.origin.y, 100, 50)];
        
        if ([[dict valueForKey:@"is_enable"] integerValue]==1) {
            [enableButton setTitle:@"Disable" forState:UIControlStateNormal];
        }else{
            [enableButton setTitle:@"Enable" forState:UIControlStateNormal];
        }
        [enableButton setTag:5];
        enableButton.layer.cornerRadius = 5;
        enableButton.layer.borderWidth = 1.0;
        enableButton.layer.borderColor = [[UIColor blackColor] CGColor];
        [enableButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [enableButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [enableButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [enableButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:enableButton];
    }
}

 */

-(void) setupCreateEmailView:(NSMutableDictionary *) dict{
    UIButton *backgroundButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [backgroundButton setFrame:self.view.bounds];
    [backgroundButton setBackgroundColor:[UIColor colorWithRed:192/255.0 green:192/255.0 blue:192/255.0 alpha:0.7]];
    [self.view addSubview:backgroundButton];
    
    UIScrollView *view = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        view = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, 500, 600)];
    }else{
        view = [[UIScrollView alloc] initWithFrame:CGRectMake(0, 0, 400, 280)];
    }

    
    [view setBackgroundColor:[UIColor whiteColor]];
    [view setClipsToBounds:YES];
    view.layer.cornerRadius = 5;
    view.center = CGPointMake(backgroundButton.frame.size.width/2, backgroundButton.frame.size.height/2);
    [backgroundButton addSubview:view];
    
    //Title
    UILabel *editLabel = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        editLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, view.frame.size.width, 50)];
        [editLabel setFont:[UIFont systemFontOfSize:20.0f]];
    }else{
        editLabel = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, view.frame.size.width, 30)];
        [editLabel setFont:[UIFont systemFontOfSize:13.0f]];
    }
    [editLabel setText:@"INFO VIEW"];
    [editLabel setTextColor:[UIColor whiteColor]];
    [editLabel setTextAlignment:NSTextAlignmentCenter];
    
    [editLabel setBackgroundColor:[UIColor colorWithRed:166/255.0 green:151/255.0 blue:102.0/255.0 alpha:1.0]];
    [view addSubview:editLabel];
    
    UIButton *createButton = nil;
    if (isNew) {
        //Button
        createButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [createButton setTitle:@"Create" forState:UIControlStateNormal];
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 20, view.frame.size.width - 40, 50)];
        }else{
            [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 10, view.frame.size.width - 40, 30)];
        }
        
        
        [createButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [createButton setTag:1];
        [createButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        createButton.layer.cornerRadius = 5;
        createButton.layer.borderColor = [[UIColor blackColor] CGColor];
        createButton.layer.borderWidth =  1.0;
        [createButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [createButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:createButton];
    }
    
    
    if (!isNew) {
        createButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [createButton setTitle:@"Update" forState:UIControlStateNormal];
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 20, view.frame.size.width - 40, 50)];
        }else{
            [createButton setFrame:CGRectMake(20, editLabel.frame.size.height + 10, view.frame.size.width - 40, 30)];
        }
        
        [createButton setTag:2];
        [createButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [createButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        createButton.layer.cornerRadius = 5;
        createButton.layer.borderColor = [[UIColor blackColor] CGColor];
        createButton.layer.borderWidth =  1.0;
        [createButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [createButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:createButton];
    }
    
    //Info
    //Family name
    UILabel *familyNameLabel = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        familyNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, createButton.frame.size.height + createButton.frame.origin.y + 30, 120, 50)];
    }else{
        familyNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, createButton.frame.size.height + createButton.frame.origin.y + 5, 120, 30)];
        [familyNameLabel setFont:[UIFont systemFontOfSize:12.0]];
    }
    [familyNameLabel setText:@"Family Name*:"];
    [view addSubview:familyNameLabel];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        familyTextfield = [[UITextField alloc] initWithFrame:CGRectMake(familyNameLabel.frame.origin.x + familyNameLabel.frame.size.width + 20, familyNameLabel.frame.origin.y, view.frame.size.width - 60 - familyNameLabel.frame.size.width, 50)];
    }else{
        familyTextfield = [[UITextField alloc] initWithFrame:CGRectMake(familyNameLabel.frame.origin.x + familyNameLabel.frame.size.width + 20, familyNameLabel.frame.origin.y, view.frame.size.width - 50 - familyNameLabel.frame.size.width, 30)];
    }
    familyTextfield.layer.borderWidth = 1.0;
    familyTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    familyTextfield.layer.cornerRadius = 5.0;
    [familyTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, familyTextfield.frame.size.height)]];
    [familyTextfield setLeftViewMode:UITextFieldViewModeAlways];
    [familyTextfield setClipsToBounds:YES];
    if (dict) {
        [familyTextfield setText:[dict valueForKey:@"family_name"]];
    }
    [view addSubview:familyTextfield];
    
    //Given name
    UILabel *givenNameLabel = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        givenNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, familyNameLabel.frame.size.height + familyNameLabel.frame.origin.y + 10, familyNameLabel.frame.size.width, familyNameLabel.frame.size.height)];
    }else{
        givenNameLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, familyNameLabel.frame.size.height + familyNameLabel.frame.origin.y + 5, familyNameLabel.frame.size.width, familyNameLabel.frame.size.height)];
        
        [givenNameLabel setFont:[UIFont systemFontOfSize:12.0]];
    }
    [givenNameLabel setText:@"Given Name*:"];
    [view addSubview:givenNameLabel];
    
    
    giveNameTextfield = [[UITextField alloc] initWithFrame:CGRectMake(givenNameLabel.frame.size.width + 20 + givenNameLabel.frame.origin.x, givenNameLabel.frame.origin.y, familyTextfield.frame.size.width, familyTextfield.frame.size.height)];
    giveNameTextfield.layer.cornerRadius = 5;
    giveNameTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    giveNameTextfield.layer.borderWidth = 1.0;
    [giveNameTextfield setClipsToBounds:YES];
    [giveNameTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, giveNameTextfield.frame.size.height)]];
    [giveNameTextfield setLeftViewMode:UITextFieldViewModeAlways];
    if (dict != nil) {
        [giveNameTextfield setText:[dict valueForKey:@"given_name"]];
    }
    [view addSubview:giveNameTextfield];
    
    //telephone
    UILabel *telephoneLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, givenNameLabel.frame.size.height + givenNameLabel.frame.origin.y + 10, givenNameLabel.frame.size.width, givenNameLabel.frame.size.height)];
    [telephoneLabel setText:@"Telephone*:"];

    [view addSubview:telephoneLabel];
    
    telephoneTextfield = [[UITextField alloc] initWithFrame:CGRectMake(telephoneLabel.frame.size.width + telephoneLabel.frame.origin.x + 20, telephoneLabel.frame.origin.y, giveNameTextfield.frame.size.width, giveNameTextfield.frame.size.height)];
    telephoneTextfield.layer.cornerRadius = 5;
    telephoneTextfield.layer.borderWidth = 1.0;
    telephoneTextfield.layer.borderColor = [[UIColor blackColor] CGColor];
    [telephoneTextfield setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, telephoneTextfield.frame.size.height)]];
    [telephoneTextfield setLeftViewMode:UITextFieldViewModeAlways];
    [telephoneTextfield setClipsToBounds:YES];
    [telephoneTextfield setDelegate:self];
    if (dict) {
        [telephoneTextfield setText:[dict valueForKey:@"telephone"]];
    }
    [view addSubview:telephoneTextfield];
    
    UILabel *distributeLabel = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        distributeLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, telephoneLabel.frame.size.height  + telephoneLabel.frame.origin.y , 150, telephoneLabel.frame.size.height)];
    }else{
        distributeLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, telephoneLabel.frame.size.height  + telephoneLabel.frame.origin.y , 120, telephoneLabel.frame.size.height)];
        [distributeLabel setFont:[UIFont systemFontOfSize:12.0]];
    }
    [distributeLabel setText:@"Distribution Email*"];
    [view addSubview:distributeLabel];
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
       nameEmail = [[UITextField alloc] initWithFrame:CGRectMake(20, distributeLabel.frame.size.height  + distributeLabel.frame.origin.y, (view.frame.size.width - 40 - 30 )*2/3, 50)];
    }else{
        nameEmail = [[UITextField alloc] initWithFrame:CGRectMake(20, distributeLabel.frame.size.height  + distributeLabel.frame.origin.y, (view.frame.size.width - 40 - 30 )*2/3, 30)];
        [telephoneLabel setFont:[UIFont systemFontOfSize:12.0]];
    }
    
    nameEmail.layer.borderWidth = 1.0;
    nameEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    [nameEmail setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, nameEmail.frame.size.height)]];
    [nameEmail setDelegate:self];
    [nameEmail setLeftViewMode:UITextFieldViewModeAlways];
    [view addSubview:nameEmail];
    UILabel *acongLabel = [[UILabel alloc] initWithFrame:CGRectMake(nameEmail.frame.size.width + nameEmail.frame.origin.x, nameEmail.frame.origin.y, 30, nameEmail.frame.size.height)];
    [acongLabel setTextAlignment:NSTextAlignmentCenter];
    [acongLabel setText:@"@"];
    [view addSubview:acongLabel];

    addressEmail = [[UITextField alloc] initWithFrame:CGRectMake(acongLabel.frame.size.width + acongLabel.frame.origin.x, acongLabel.frame.origin.y, (view.frame.size.width - 40 - 30 )/3, acongLabel.frame.size.height)];
    [addressEmail setLeftView:[[UIView alloc] initWithFrame:CGRectMake(0, 0, 10, addressEmail.frame.size.height)]];
    [addressEmail setLeftViewMode:UITextFieldViewModeAlways];
    addressEmail.layer.borderColor = [[UIColor blackColor] CGColor];
    addressEmail.layer.borderWidth = 1.0;
    [addressEmail setDelegate:self];
    if (dict) {
        NSArray *arr = [[dict valueForKey:@"email"] componentsSeparatedByString:@"@"];
        [nameEmail setText:[arr objectAtIndex:0]];
        [addressEmail setText:[arr objectAtIndex:1]];
    }
    [view addSubview:addressEmail];
    
    //
    report_email_button = [UIButton buttonWithType:UIButtonTypeCustom];
    [report_email_button setFrame:CGRectMake(nameEmail.frame.origin.x, nameEmail.frame.size.height + nameEmail.frame.origin.y + 10, createButton.frame.size.width, createButton.frame.size.height)];
    [report_email_button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [report_email_button setTitle:@"Email Reports" forState:UIControlStateNormal];
    [report_email_button setTitleEdgeInsets:UIEdgeInsetsMake(0, 0, 0, report_email_button.frame.size.width - 150)];
    report_email_button.layer.borderWidth = 1.0;
    report_email_button.layer.borderColor = [[UIColor grayColor] CGColor];
    report_email_button.layer.cornerRadius = 5;
    [report_email_button setImage:[UIImage imageNamed:@"checkIcon"] forState:UIControlStateNormal];
    [report_email_button setTag:1];
    [report_email_button addTarget:self action:@selector(updateReport:) forControlEvents:UIControlEventTouchUpInside];
    [report_email_button setImageEdgeInsets:UIEdgeInsetsMake(5, report_email_button.frame.size.width - 40, 5, 5)];
    if ([dict valueForKey:@"is_report_email"] != nil) {
        if ([[dict valueForKey:@"is_report_email"] isEqualToString:@"0"]) {
            [report_email_button setImage:nil forState:UIControlStateNormal];
        }
    }
    
    [view addSubview:report_email_button];
    
    patient_button = [UIButton buttonWithType:UIButtonTypeCustom];
    [patient_button setFrame:CGRectMake(nameEmail.frame.origin.x, report_email_button.frame.size.height + report_email_button.frame.origin.y , createButton.frame.size.width, createButton.frame.size.height)];
    [patient_button setTitle:@"Patient Reports" forState:UIControlStateNormal];
    [patient_button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [patient_button setTitleEdgeInsets:UIEdgeInsetsMake(0, 0, 0, patient_button.frame.size.width - 180)];
    patient_button.layer.cornerRadius = 5;
    patient_button.layer.borderColor = [[UIColor grayColor] CGColor];
    patient_button.layer.borderWidth = 1.0;
    [patient_button setTag:2];
    [patient_button setImage:[UIImage imageNamed:@"checkIcon"] forState:UIControlStateNormal];
    [patient_button setContentHorizontalAlignment:UIControlContentHorizontalAlignmentLeft];
    [patient_button setImageEdgeInsets:UIEdgeInsetsMake(5, patient_button.frame.size.width - 40, 5, 5)];
    [patient_button addTarget:self action:@selector(updateReport:) forControlEvents:UIControlEventTouchUpInside];
    if ([dict valueForKey:@"is_report_patient"] != nil) {
        if ([[dict valueForKey:@"is_report_patient"] isEqualToString:@"0"]) {
            [patient_button setImage:nil forState:UIControlStateNormal];
        }
    }
    
    [view addSubview:patient_button];
    
    //Save and Cancel button
    UIButton *cancelButton = cancelButton = [UIButton buttonWithType:UIButtonTypeCustom];;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        
//        [cancelButton setFrame:CGRectMake(view.frame.size.width - 120, view.frame.size.height - 60, 100, 50)];
        [cancelButton setFrame:CGRectMake(view.frame.size.width - 120, patient_button.frame.size.height + patient_button.frame.origin.y + 30, 100, 50)];
    }else{
//        cancelButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [cancelButton setFrame:CGRectMake(view.frame.size.width - 120, patient_button.frame.size.height + patient_button.frame.origin.y + 20, 100, 30)];
    }
    
    [cancelButton setTitle:@"Cancel" forState:UIControlStateNormal];
    [cancelButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];;
    [cancelButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
    [cancelButton setTag:4];
    cancelButton.layer.cornerRadius = 5;
    cancelButton.layer.borderColor = [[UIColor blackColor] CGColor];
    cancelButton.layer.borderWidth = 1.0;
    [cancelButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
    [cancelButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
    [view addSubview:cancelButton];
    if (!isNew) {
        UIButton *enableButton = [UIButton buttonWithType:UIButtonTypeCustom];
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [enableButton setFrame:CGRectMake(view.frame.size.width - 240, cancelButton.frame.origin.y, 100, 50)];
        }else{
            [enableButton setFrame:CGRectMake(view.frame.size.width - 240, cancelButton.frame.origin.y, 100, 30)];
        }
        
        
        if ([[dict valueForKey:@"is_enable"] integerValue]==1) {
            [enableButton setTitle:@"Disable" forState:UIControlStateNormal];
        }else{
            [enableButton setTitle:@"Enable" forState:UIControlStateNormal];
        }
        [enableButton setTag:5];
        enableButton.layer.cornerRadius = 5;
        enableButton.layer.borderWidth = 1.0;
        enableButton.layer.borderColor = [[UIColor blackColor] CGColor];
        [enableButton setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
        [enableButton addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [enableButton addTarget:self action:@selector(buttonTouchDown:) forControlEvents:UIControlEventTouchDown];
        [enableButton addTarget:self action:@selector(buttonTouchOutside:) forControlEvents:UIControlEventTouchDragOutside];
        [view addSubview:enableButton];
    }
    
    [view setContentSize:CGSizeMake(view.frame.size.width, cancelButton.frame.size.height + cancelButton.frame.origin.y  + 100)];
}
-(void) updateReport:(UIButton *) button{
    if (button.currentImage != nil) {
        [button setImage:nil forState:UIControlStateNormal];
    }else{
        [button setImage:[UIImage imageNamed:@"checkIcon"] forState:UIControlStateNormal];
    }
    
    //update data
    switch (button.tag) {
        case 1:
        {
            
        }
            break;
        case 2:{

        }
            break;
        default:
            break;
    }
}
-(void) buttonClicked:(UIButton *) button{
    switch (button.tag) {
        case 1:{ //create
            NSString *name = [NSString stringWithFormat:@"%@@%@",nameEmail.text,addressEmail.text];
            NSMutableDictionary *dict = [NSMutableDictionary dictionaryWithObjectsAndKeys:familyTextfield.text,@"family_name",giveNameTextfield.text,@"given_name",telephoneTextfield.text,@"telephone",name,@"email",[NSNumber numberWithInt:1],@"is_enable",[NSNumber numberWithInt:0],@"id", nil];
            if (report_email_button.currentImage == nil) {
                [dict setValue:@"0" forKey:@"is_report_email"];
            }else{
                [dict setValue:@"1" forKey:@"is_report_email"];
            }
            if (patient_button.currentImage == nil) {
                [dict setValue:@"0" forKey:@"is_report_patient"];
            }else{
                [dict setValue:@"1" forKey:@"is_report_patient"];
            }
            [arrPeopleToReceive addObject:dict];
            
            //insert to table
            [mainTableView beginUpdates];
            NSArray *arr = [NSArray arrayWithObjects:[NSIndexPath indexPathForItem:arrPeopleToReceive.count - 1 inSection:0], nil];
            [mainTableView insertRowsAtIndexPaths:arr withRowAnimation:UITableViewRowAnimationBottom];
            [mainTableView endUpdates];
            //
            //Send to server
            dispatch_queue_t myQueue = dispatch_queue_create("hungcao.insert", 0);
            dispatch_async(myQueue, ^{
                NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/insertEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
                if (![retVal isEqualToString:@"0"]) { //success
                    [dict setValue:retVal forKey:@"id"];
                    [arrPeopleToReceive replaceObjectAtIndex:(arrPeopleToReceive.count - 1) withObject:dict];
                    searchBar.text = @"";
                }else{ //Failed
                    [arrPeopleToReceive removeLastObject];
                    [mainTableView beginUpdates];
                    NSArray *arr = [NSArray arrayWithObjects:[NSIndexPath indexPathForItem:arrPeopleToReceive.count - 1 inSection:0], nil];
                    [mainTableView deleteRowsAtIndexPaths:arr withRowAnimation:UITableViewRowAnimationBottom];
                    [mainTableView endUpdates];
                }
            });
        }
            break;
        case 2:{ //update
            NSDictionary *getdict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
            
            NSMutableDictionary *dict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
            [dict setValue:familyTextfield.text forKey:@"family_name"];
            [dict setValue:giveNameTextfield.text forKey:@"given_name"];
            [dict setValue:[NSString stringWithFormat:@"%@@%@",nameEmail.text,addressEmail.text] forKey:@"email"];
            [dict setValue:telephoneTextfield.text forKey:@"telephone"];
            
            if (report_email_button.currentImage == nil) {
                [dict setValue:@"0" forKey:@"is_report_email"];
            }else{
                [dict setValue:@"1" forKey:@"is_report_email"];
            }
            if (patient_button.currentImage == nil) {
                [dict setValue:@"0" forKey:@"is_report_patient"];
            }else{
                [dict setValue:@"1" forKey:@"is_report_patient"];
            }
            
            if (isSearching) {
                [arrPeopleSearched replaceObjectAtIndex:currentIndexClicked withObject:dict];
                
            }else{
                [arrPeopleToReceive replaceObjectAtIndex:currentIndexClicked withObject:dict];
            }
            
            UITableViewCell *cell = [mainTableView cellForRowAtIndexPath:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0]];
            [mainTableView beginUpdates];
            //set value for tableview
            [mainTableView reloadRowsAtIndexPaths:[NSArray arrayWithObjects:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0], nil] withRowAnimation:UITableViewRowAnimationBottom];
            [mainTableView endUpdates];
    
            //end
            
            [MBProgressHUD showHUDAddedTo:self.view animated:YES];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/updateEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
                if ([retVal isEqualToString:@"1"]) { //sucess
                }else{ //sucess
                    [cell.textLabel setText:[NSString stringWithFormat:@"%@ %@",[getdict valueForKey:@"given_name"],[getdict valueForKey:@"family_name"]]];
                    [cell.detailTextLabel setText:[getdict valueForKey:@"email"]];
                }
                
                // Do something...
                [MBProgressHUD hideHUDForView:self.view animated:YES];
            });
            
        }break;
        case 3:{ //delete
            NSDictionary *dict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
            [arrPeopleToReceive removeObjectAtIndex:currentIndexClicked];
            [mainTableView beginUpdates];
            [mainTableView deleteRowsAtIndexPaths:[NSArray arrayWithObjects:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0], nil] withRowAnimation:UITableViewRowAnimationBottom];
            [mainTableView endUpdates];
            
            NSDictionary *dictPost = [NSDictionary dictionaryWithObjectsAndKeys:[dict valueForKey:@"id"],@"id", nil];
            [MBProgressHUD showHUDAddedTo:self.view animated:YES];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/deleteEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dictPost options:kNilOptions error:nil]];
                if ([retVal isEqualToString:@"1"]) { //sucess
                    
                }else{ //sucess
                    [arrPeopleToReceive addObject:dict];
                    [mainTableView beginUpdates];
                    [mainTableView insertRowsAtIndexPaths:[NSArray arrayWithObjects:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0], nil] withRowAnimation:UITableViewRowAnimationBottom];
                    [mainTableView endUpdates];
                    
                }
                // Do something...
                [MBProgressHUD hideHUDForView:self.view animated:YES];
            });
        }
            break;
        case 5:{ // Enable|Disable
            NSMutableDictionary *dict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
            UITableViewCell *cell = [mainTableView cellForRowAtIndexPath:[NSIndexPath indexPathForItem:currentIndexClicked inSection:0]];
            if ([[dict valueForKey:@"is_enable"] integerValue] == 0) { //Enable
                [dict setValue:[NSNumber numberWithInt:1] forKey:@"is_enable"];
                [cell setAccessoryView:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"checkIcon"]]];
            }else{ //Disable
                [dict setValue:[NSNumber numberWithInt:0] forKey:@"is_enable"];
                [cell setAccessoryView:nil];
            }
            if (isSearching) {
                [arrPeopleSearched replaceObjectAtIndex:currentIndexClicked withObject:dict];
            }else{
                [arrPeopleToReceive replaceObjectAtIndex:currentIndexClicked withObject:dict];
            }
            
            [MBProgressHUD showHUDAddedTo:self.view animated:YES];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                NSString *retVal = [rteleWebserviceManager sendPOSTDataSynchronousWebserviceRequest:@"api/updateEmailReport" postData:[NSJSONSerialization dataWithJSONObject:dict options:kNilOptions error:nil]];
                if ([retVal isEqualToString:@"1"]) { //Success
                    
                }else{ //Failed
                    NSDictionary *getdict = nil;
                    if (isSearching) {
                        getdict = [arrPeopleSearched objectAtIndex:currentIndexClicked];
                    }else{
                        getdict = [arrPeopleToReceive objectAtIndex:currentIndexClicked];
                    }
                    if ([[getdict valueForKey:@"is_enable"] integerValue]) {
                        [cell setAccessoryView:[[UIImageView alloc] initWithImage:[UIImage imageNamed:@"checkIcon"]]];
                    }else{
                        [cell setAccessoryView:nil];
                    }
                }
                // Do something...
                [MBProgressHUD hideHUDForView:self.view animated:YES];
            });

        }
            break;
        default:{ //cancel
            [button.superview.superview removeFromSuperview];
        }
            break;
    }
    
    [button.superview.superview removeFromSuperview];
}

-(void) buttonTouchDown:(UIButton *) button{
    [button setBackgroundColor:[UIColor grayColor]];
    [button setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
}

-(void) buttonTouchOutside:(UIButton *) button{
    [button setBackgroundColor:[UIColor whiteColor]];
    [button setTitleColor:[UIColor blackColor] forState:UIControlStateNormal];
}
#pragma mark - UITextFieldDelegate-
-(void)textFieldDidBeginEditing:(UITextField *)textField{
    activeField = textField;
}

-(BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string{
//    NSCharacterSet * set = [[NSCharacterSet characterSetWithCharactersInString:@"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ0123456789"] invertedSet];
//    
//    if ([string rangeOfCharacterFromSet:set].location == NSNotFound) {
//        NSLog(@"This string contains illegal characters");
//        return FALSE;
//    }
    if ([string isEqualToString:@"\""]) {
        return FALSE;
    }
    
    return YES;
}
#pragma mark - Keyboard
-(void) keyboardDidShow:(NSNotification *) notf{
    NSDictionary *dictUser = [notf userInfo];
    CGRect sizeKeyboard = [[dictUser valueForKey:UIKeyboardFrameBeginUserInfoKey] CGRectValue];

    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"8.0")) {
        if (activeField.frame.origin.y > (self.view.frame.size.height - 100 - sizeKeyboard.size.height)) {
            [UIView animateKeyframesWithDuration:0.5 delay:0.0 options:UIViewKeyframeAnimationOptionAllowUserInteraction animations:^{
                [activeField.superview setFrame:CGRectMake(activeField.superview.frame.origin.x, activeField.superview.frame.origin.y - 200, activeField.superview.frame.size.width, activeField.superview.frame.size.height)];
            } completion:nil];
        }
    }else{
        if (activeField.frame.origin.y > (self.view.frame.size.height - sizeKeyboard.size.height)) {
            [UIView animateKeyframesWithDuration:0.5 delay:0.0 options:UIViewKeyframeAnimationOptionAllowUserInteraction animations:^{
                [activeField.superview setFrame:CGRectMake(activeField.superview.frame.origin.x, activeField.superview.frame.origin.y - 200, activeField.superview.frame.size.width, activeField.superview.frame.size.height)];
            } completion:nil];
        }
    }
    
}
-(void) keyboardDidHide:(NSNotification *) notf{
    [UIView animateKeyframesWithDuration:0.5 delay:0.0 options:UIViewKeyframeAnimationOptionAllowUserInteraction animations:^{
        activeField.superview.center = CGPointMake(activeField.superview.superview.frame.size.width/2, activeField.superview.superview.frame.size.height/2);
    } completion:^(BOOL finished) {
        activeField = nil;
    }];
    
}
@end
