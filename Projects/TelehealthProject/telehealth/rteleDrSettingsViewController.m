//
//  rteleDrSettingsViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleDrSettingsViewController.h"
#import "rteleAppDelegate.h"
#import "constants.h"
#import "rteleDoctors.h"
#import "SBJson.h"
#import "rteleDoctors.h"
#import "NSDataAdditions.h"
#import "MBProgressHUD.h"

//  huy code
#import "NJOPasswordStrengthEvaluator.h"
//  end

@interface rteleDrSettingsViewController ()<UITableViewDelegate, UITableViewDataSource,UITextFieldDelegate>{
    NSInteger isNotificationValue;
    NSInteger isOperationValue;
    
    //
//    UIViewController *currentViewController;
    UIView *currentViewChange;
}
@property (readwrite, nonatomic, strong) NJOPasswordValidator *lenienValidator;
@property (readwrite, nonatomic, strong) NJOPasswordValidator *validator;
@property (nonatomic, strong) IBOutlet UITableView *featureTableView;
@property (readwrite, nonatomic, strong) IBOutlet UIProgressView *passwordStrengthMeterView;
@property (readwrite, nonatomic, strong) IBOutlet UITextField* textfield;
@end

@implementation rteleDrSettingsViewController
@synthesize doctor;
@synthesize scrollview;
@synthesize name;
@synthesize address;
@synthesize code;
@synthesize email;
@synthesize username;
@synthesize phone;
@synthesize prescriberNumber;
@synthesize popoverController;
@synthesize sign;
BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
bool edit;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    self.lenienValidator = [NJOPasswordValidator standardValidator];
    return self;
}

-(NJOPasswordValidator *)validator {
    return  self.lenienValidator;
}

-(IBAction)update:(id)sender{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [activeField resignFirstResponder];
    [self performSelector:@selector(updateDeffered) withObject:nil afterDelay:0.5];
}
-(void)updateDeffered{
    NSMutableDictionary* json = [[NSMutableDictionary alloc] init];
    [json setValue:name.text forKey:@"name"];
    [json setValue:address.text forKey:@"address"];
    [json setValue:code.text forKey:@"code"];
    [json setValue:email.text forKey:@"email"];
    [json setValue:username.text forKey:@"username"];
    [json setValue:phone.text forKey:@"phone"];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [json setValue:doctor.cid forKey:@"companyId"];
    [json setValue:doctor.type forKey:@"type"];
    [json setValue:doctor.mid forKey:@"memId"];
    //update check
    if (isOperationValue) {
        [json setValue:@"1" forKey:@"isOperationValue"];
    }else{
        [json setValue:@"0" forKey:@"isOperationValue"];
    }
    
    if (isNotificationValue) {
        [json setValue:@"1" forKey:@"isNotificationValue"];
    }else{
        [json setValue:@"0" forKey:@"isNotificationValue"];
    }
    //end
    NSData *imagedata=[NSData dataWithData:UIImagePNGRepresentation(sign.image)];
    NSString *base64string = [imagedata base64Encoding];
    
    [json setValue:base64string forKey:@"drsign"];
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    //NSLog(@"%@", [[jsonWriter stringWithObject:json]stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]);
    NSString *post = [NSString stringWithFormat:@"data=%@",
                      (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
    
//    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/updateDoctor" postData:post showAlert:YES];

    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updateDoctor/?token=%@",[defaults objectForKey:@"tokenUser"]] postData:post showAlert:YES];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    if ([retval isEqualToString:@"1"]){
        if (!edit)
            [defaults setValue:username.text forKey:@"username"];
    }
}
//#warning TODO: waiting for server changes: http://teambox.0171.com/projects/redimed/tasks/2581


- (void)viewDidLoad
{
    [super viewDidLoad];
//    currentViewController = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardShow) name:UIKeyboardWillShowNotification object:nil];
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardHide) name:UIKeyboardWillHideNotification object:nil];
    }
    currentViewChange = nil;
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    NSRegularExpression * regex = [NSRegularExpression regularExpressionWithPattern:@" " options:NSRegularExpressionCaseInsensitive error:nil];
    if (nil==doctor){
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        doctor = [[[rteleDoctors alloc] init] loadDataWithId:[defaults objectForKey:@"memId"]];
        //NSLog(@"%@", doctor.detail);
        name.text = [doctor.detail objectForKey:@"name"];
        address.text = [doctor.detail objectForKey:@"address"];
        code.text = [doctor.detail objectForKey:@"code"];
        email.text = [doctor.detail objectForKey:@"email"];
        username.text = doctor.username;
        phone.text = [doctor.detail objectForKey:@"phone"];
        edit = false;
        
        isNotificationValue = doctor.isNotification;
        isOperationValue = doctor.isOperation;
        if (nil!=[doctor.detail objectForKey:@"drsign"])
            sign.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:[regex stringByReplacingMatchesInString:[doctor.detail objectForKey:@"drsign"] options:0 range:NSMakeRange(0, [[doctor.detail objectForKey:@"drsign"] length]) withTemplate:@"+"]]];
    }else{
        doctor = [[[rteleDoctors alloc] init] loadDataWithId:doctor.mid];
        edit = true;
        name.text = [doctor.detail objectForKey:@"name"];
        address.text = [doctor.detail objectForKey:@"address"];
        code.text = [doctor.detail objectForKey:@"code"];
        email.text = [doctor.detail objectForKey:@"email"];
        username.text = doctor.username;
        phone.text = [doctor.detail objectForKey:@"phone"];
        isNotificationValue = doctor.isNotification;
        isOperationValue = doctor.isOperation;
        if (nil!=[doctor.detail objectForKey:@"drsign"])
            sign.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:[regex stringByReplacingMatchesInString:[doctor.detail objectForKey:@"drsign"] options:0 range:NSMakeRange(0, [[doctor.detail objectForKey:@"drsign"] length]) withTemplate:@"+"]]];
    }
    
    if ([doctor.username isEqualToString:@"redimed"]){
        name.enabled = false;
        username.enabled = false;
    }

    //NSLog(@"%@",[regex stringByReplacingMatchesInString:[doctor.detail objectForKey:@"drsign"] options:0 range:NSMakeRange(0, [[doctor.detail objectForKey:@"drsign"] length]) withTemplate:@"+"]);
    [delegate hideActivityViewer];
    
    [self.featureTableView setTableFooterView:[[UIView alloc] initWithFrame:CGRectZero]];

    [[NSNotificationCenter defaultCenter] addObserverForName:UITextFieldTextDidChangeNotification object:_textfield queue:[NSOperationQueue mainQueue] usingBlock:^(NSNotification *note) {
        [self updatePasswordStrength:note.object];
    }];
    [self updatePasswordStrength:self];
}
-(IBAction)startCamera:(id)sender{
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    imagePickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
    imagePickerController.delegate = self;
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        popoverController=[[UIPopoverController alloc] initWithContentViewController:imagePickerController];
        popoverController.delegate=self;
        [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
    }else{
        NSLog(@"\n start camera");
        [self presentViewController:imagePickerController animated:YES completion:nil];
    }

}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [popoverController dismissPopoverAnimated:YES];
    }
    else{
        [picker dismissViewControllerAnimated:YES completion:nil];
    }
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    //UIImageView *imageView;
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    // Handle the incoming data/object
	sign.image = image;
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [popoverController dismissPopoverAnimated:YES];
    }else{
        [picker dismissViewControllerAnimated:YES completion:nil];
    }
    
    
}
-(IBAction)changePass:(id)sender{
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        UIViewController* test = [[UIViewController alloc] init];
        test.view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 400, 160)];
        [test.view setBackgroundColor:[UIColor whiteColor]];
        //[scrollview addSubview:imageView];
        UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, 400, 44)];
        toolbar.barStyle =UIBarStyleBlackTranslucent;
        UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Change" style:UIBarButtonItemStyleBordered target:self action:@selector(doChangePass:)];
        //toolbar.userInteractionEnabled = true;
        [test.view setUserInteractionEnabled:true];
        
        [cancel setTag:((UIButton*)sender).tag];
        UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Change password"
                                                                 style:UIBarButtonItemStylePlain
                                                                target:nil
                                                                action:nil];
        
        UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                                target:nil
                                                                                action:nil];
        
        NSArray *items = [[NSArray alloc] initWithObjects:cancel, spacer, item, spacer, nil];
        
        [toolbar setItems:items];
        [test.view addSubview:toolbar];
        // add fields
        UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(15, 60, 150, 35)];
        label.text =  @"New password:";
        [label setTextAlignment:NSTextAlignmentRight];
        [test.view addSubview:label];
        _textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 63,200 ,30)];
        [_textfield setBorderStyle:UITextBorderStyleRoundedRect];
        [_textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
        [_textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
        [_textfield setSecureTextEntry:YES];
        _textfield.tag = 100;
        [test.view addSubview:_textfield];
        
        _passwordStrengthMeterView = [[UIProgressView alloc]initWithProgressViewStyle:UIProgressViewStyleBar];
        _passwordStrengthMeterView.frame = CGRectMake(175, 98, 180, 30);
        _passwordStrengthMeterView.progress = 0.0f;
        [test.view addSubview:_passwordStrengthMeterView];
        
        label = [[UILabel alloc] initWithFrame:CGRectMake(15, 105, 150, 35)];
        label.text = @"Confirm password:";
        [label setTextAlignment:NSTextAlignmentRight];
        [test.view addSubview:label];
        _textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 108,200 ,30)];
        [_textfield setBorderStyle:UITextBorderStyleRoundedRect];
        [_textfield setSecureTextEntry:YES];
        [_textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
        [_textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
        _textfield.tag = 200;
        [test.view addSubview:_textfield];
        label = [[UILabel alloc] initWithFrame:CGRectMake(15, 150, 370, 35)];
        label.text = @"Please fill in new password and hit Change.";
        label.tag = 300;
        [label setTextAlignment:NSTextAlignmentCenter];
        [label setTextColor:[UIColor redColor]];
        [test.view addSubview:label];
        
        popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
        popoverController.delegate=self;
        popoverController.popoverContentSize=CGSizeMake(400, 200);
        [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionDown animated:YES];
    }else{
        UIButton *backgroundButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [backgroundButton setBackgroundColor:[UIColor colorWithRed:220/255.0 green:220/255.0 blue:220/255.0 alpha:0.7]];
        [backgroundButton addTarget:self action:@selector(backgroundButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [backgroundButton setFrame:self.view.bounds];
        
        UIView *changePassView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 400, 200)];
        changePassView.center = CGPointMake(backgroundButton.frame.size.width/2, backgroundButton.frame.size.height/2);
        [changePassView setBackgroundColor:[UIColor whiteColor]];
        [backgroundButton addSubview:changePassView];
        
        
        UILabel *titleView = [[UILabel alloc] initWithFrame:CGRectMake(0, 0, changePassView.frame.size.width, 44)];
        [titleView setBackgroundColor:[UIColor grayColor]];
        [titleView setText:@"Change Password"];
        [titleView setTextAlignment:NSTextAlignmentCenter];
        [titleView setTextColor:[UIColor whiteColor]];
        [changePassView addSubview:titleView];
        
        UIButton *buttonChange = [UIButton buttonWithType:UIButtonTypeRoundedRect];
        [buttonChange setTitle:@"Change" forState:UIControlStateNormal];
        [buttonChange addTarget:self action:@selector(doChangePass:) forControlEvents:UIControlEventTouchUpInside];
        [buttonChange setFrame:CGRectMake(0, 0, 80, 44)];
        [changePassView addSubview:buttonChange];
        
        UILabel *pass1 = [[UILabel alloc] initWithFrame:CGRectMake(20, 64, 150, 30)];
        [pass1 setText:@"New password:"];
        [pass1 setTextAlignment:NSTextAlignmentRight];
        [changePassView addSubview:pass1];
        

        UITextField* textfield = [[UITextField alloc] initWithFrame:CGRectMake(pass1.frame.size.width + pass1.frame.origin.x + 10, pass1.frame.origin.y ,200 ,30)];
        [textfield setBorderStyle:UITextBorderStyleRoundedRect];
        [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
        [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
        [textfield setSecureTextEntry:YES];
        textfield.tag = 100;
        [textfield setDelegate:self];
        [changePassView addSubview:textfield];
        
        
        
        UILabel *pass2 = [[UILabel alloc] initWithFrame:CGRectMake(20, pass1.frame.size.height + pass1.frame.origin.y + 10, 150, 30)];
        [pass2 setText:@"Confirm password:"];
        [pass2 setTextAlignment:NSTextAlignmentRight];
        [changePassView addSubview:pass2];
        
        textfield = [[UITextField alloc] initWithFrame:CGRectMake(pass2.frame.size.width + pass2.frame.origin.x + 10, pass2.frame.origin.y,200 ,30)];
        [textfield setBorderStyle:UITextBorderStyleRoundedRect];
        [textfield setSecureTextEntry:YES];
        [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
        [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
        textfield.tag = 200;
        [textfield setDelegate:self];
        [changePassView addSubview:textfield];
        
        UILabel *informLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, pass2.frame.size.height + pass2.frame.origin.y + 10, changePassView.frame.size.width - 40, 30)];
        [informLabel setTextColor:[UIColor redColor]];
        [informLabel setText:@"Please fill in new password and hit Change."];
        [informLabel setTag:300];
        [changePassView addSubview:informLabel];

        currentViewChange = changePassView;
        [self.view addSubview:backgroundButton];
    }
    

}

-(void) backgroundButtonClicked:(UIButton *) button{
    [button removeFromSuperview];
}
-(IBAction)doChangePass:(id)sender{
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDuration:0.5];
        [UIView commitAnimations];
        NSString *newpassword = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
        if([newpassword length] == 0) {
            ((UILabel*)[popoverController.contentViewController.view viewWithTag:300]).text = @"Password do not empty.";
        } else if ([((UITextField*)[popoverController.contentViewController.view viewWithTag:200]).text isEqualToString:newpassword]){
//        if ([((UITextField*)[popoverController.contentViewController.view viewWithTag:200]).text isEqualToString:newpassword]){
            UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
            
            UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
            CGRect frame = CGRectMake(0, 0, 400, 300);
//          CGRect frame = CGRectMake(0, 0, 400, 200);
            activity.view.frame = frame;
            [activity.view setNeedsLayout];
            [popoverController.contentViewController.view insertSubview:activity.view atIndex:99999];
            
            [self performSelector:@selector(doChangePassDeferred:) withObject:newpassword afterDelay:0.5];
        }else{
            //NSLog(@"no");
            ((UILabel*)[popoverController.contentViewController.view viewWithTag:300]).text = @"Password do not match.";
        }
    }else{
        NSString *newpassword = ((UITextField*)[currentViewChange viewWithTag:100]).text;
        if ([((UITextField*)[currentViewChange viewWithTag:200]).text isEqualToString:newpassword]){
            
            [MBProgressHUD showHUDAddedTo:self.view animated:YES];
            dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
            dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
                //Get doctor ID
                [self doChangePassDeferred:newpassword];
                // Do something...
                [MBProgressHUD hideHUDForView:self.view animated:YES];
            });
            
        }else{
            //NSLog(@"no");
            ((UILabel*)[currentViewChange viewWithTag:300]).text = @"Password do not match.";
        }
    }
    
    
    //[popoverController dismissPopoverAnimated:YES];
}
-(void)doChangePassDeferred:(NSString*) newpassword{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updatePass?newpass=%@&id=%@&type=0&token=%@", newpassword, doctor.mid,[defaults objectForKey:@"tokenUser"]] showAlert:YES];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [popoverController dismissPopoverAnimated:YES];
    }else{
        [currentViewChange.superview removeFromSuperview];
        currentViewChange = nil;
    }
    
    
    if ([retval isEqualToString:@"1"]){
        //[defaults setValue:username.text forKey:@"username"];
    }
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
}
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

- (void) viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    //NSLog(@"Registering for keyboard events");
    
    // Register for the events
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector (keyboardDidShow:)
     name: UIKeyboardDidShowNotification
     object:nil];
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector (keyboardDidHide:)
     name: UIKeyboardDidHideNotification
     object:nil];
    
    // Setup content size
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        scrollview.contentSize = CGSizeMake(SCROLLVIEW_CONTENT_WIDTH,
                                            SCROLLVIEW_CONTENT_HEIGHT);
    }else{
        scrollview.contentSize = CGSizeMake(self.view.frame.size.height,
                                            self.view.frame.size.width *3);
    }

    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
}

-(void) viewWillDisappear:(BOOL)animated {
    //NSLog (@"Unregister for keyboard events");
    [[NSNotificationCenter defaultCenter]
     removeObserver:self];
}

-(void) keyboardDidShow: (NSNotification *)notif {
    //NSLog(@"Keyboard is visible");
    // If keyboard is visible, return
    if (keyboardVisible) {
        //NSLog(@"Keyboard is already visible. Ignore notification.");
        return;
    }
    
    // Keyboard is now visible
    keyboardVisible = YES;
}
-(void) keyboardDidHide: (NSNotification *)notif {
    // Is the keyboard already shown
    if (!keyboardVisible) {
        //NSLog(@"Keyboard is already hidden. Ignore notification.");
        return;
    }
    
    [scrollview setContentOffset:CGPointMake(0, 0) animated:YES];
    // Keyboard is no longer visible
    keyboardVisible = NO;
    
}
-(BOOL) textFieldShouldBeginEditing:(UITextField*)textField {
    activeField = textField;
    if (208<activeField.frame.origin.y){
        [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
    }else{
        [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
        
    }
    //NSLog(@"%f",(activeField.frame.origin.y));
    return YES;
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

#pragma mark - UITableViewDatasource
-(NSInteger)numberOfSectionsInTableView:(UITableView *)tableView{
    return 1;
}
-(NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section{
    return 2;
}
-(UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath{
    static NSString *identifierString = @"stringIdentificer";
    UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:identifierString];
    if (!cell) {
        cell = [[UITableViewCell alloc] initWithStyle:UITableViewCellStyleDefault reuseIdentifier:identifierString];
        [cell setSelectionStyle:UITableViewCellSelectionStyleNone];
    }
    if (indexPath.row == 0) {
        [cell.textLabel setText:@"Telehealth List"];
        if (isNotificationValue) {
            [cell setAccessoryType:UITableViewCellAccessoryCheckmark];
        }else{
            [cell setAccessoryType:UITableViewCellAccessoryNone];
        }
    }else{
        [cell.textLabel setText:@"Billing List"];
        if (isOperationValue) {
            [cell setAccessoryType:UITableViewCellAccessoryCheckmark];
        }else{
            [cell setAccessoryType:UITableViewCellAccessoryNone];
        }
    }
    
    
    return cell;
}
#pragma mark - UITableViewDelegate

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath{
    NSLog(@"\n %s \n",__func__);
    
    UITableViewCell *cell = [tableView cellForRowAtIndexPath:indexPath];
    if (indexPath.row == 0) {
        if (isNotificationValue) {
            [cell setAccessoryType:UITableViewCellAccessoryNone];
            isNotificationValue = 0;
        }else{
            [cell setAccessoryType:UITableViewCellAccessoryCheckmark];
            isNotificationValue = 1;
        }
    }else{
        if (isOperationValue) {
            [cell setAccessoryType:UITableViewCellAccessoryNone];
            isOperationValue = 0;
        }else{
            [cell setAccessoryType:UITableViewCellAccessoryCheckmark];
            isOperationValue = 1;
        }
    }
    
}

-(void)dealloc{
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillHideNotification object:nil];
        [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];
    }
}
-(void) keyboardShow{
    [currentViewChange.superview setFrame:CGRectMake(0, -100, currentViewChange.superview.frame.size.width, currentViewChange.superview.frame.size.height)];
}
-(void) keyboardHide{
    [currentViewChange.superview setFrame:CGRectMake(0, 0, currentViewChange.superview.frame.size.width, currentViewChange.superview.frame.size.height)];
}
//  function checkPassStrength
-(void)updatePasswordStrength:(id) sender {
    NSString *password = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
    
    if([password length] == 0) {
        self.passwordStrengthMeterView.progress = 0.0f;
    }else {
        NJOPasswordStrength strength = [NJOPasswordStrengthEvaluator strengthOfPassword:password];
        
//        NSArray *failingRules = nil;
//        if([self.validator validatePassword:password failingRules:&failingRules]) {
            switch (strength) {
                case NJOVeryWeakPasswordStrength:
                    _passwordStrengthMeterView.progress = 0.05f;
                    _passwordStrengthMeterView.tintColor = [UIColor redColor];
                    break;
                case NJOWeakPasswordStrength:
                    _passwordStrengthMeterView.progress = 0.25f;
                    _passwordStrengthMeterView.tintColor = [UIColor orangeColor];
                    break;
                case NJOReasonablePasswordStrength:
                    _passwordStrengthMeterView.progress = 0.5f;
                    _passwordStrengthMeterView.tintColor = [UIColor yellowColor];
                    break;
                case NJOStrongPasswordStrength:
                    _passwordStrengthMeterView.progress = 0.75f;
                    _passwordStrengthMeterView.tintColor = [UIColor greenColor];
                    break;
                case NJOVeryStrongPasswordStrength:
                    _passwordStrengthMeterView.progress = 1.0f;
                    _passwordStrengthMeterView.tintColor = [UIColor cyanColor];
                    break;
            }
//        } else {
//            self.passwordStrengthMeterView.progress = 0.0f;
//            self.passwordStrengthMeterView.tintColor = [UIColor redColor];
//        }
    }
}
@end