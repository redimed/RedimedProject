//
//  rteleSettingsViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleSettingsViewController.h"
#import "rteleAppDelegate.h"
#import "constants.h"
#import "rteleEmployers.h"
#import "SBJson.h"
#import "rteleDoctors.h"
#import "MBProgressHUD.h"

@interface rteleSettingsViewController ()<UITextFieldDelegate,UITextViewDelegate>{
    UIView *currentViewChange;
}

@end

@implementation rteleSettingsViewController
@synthesize employer;
@synthesize scrollview;
@synthesize name;
@synthesize IMA;
@synthesize address;
@synthesize sname;
@synthesize code;
@synthesize smphone;
@synthesize email;
@synthesize username;
@synthesize smedic;
@synthesize phone;
@synthesize specialNotes;
@synthesize insurer;
@synthesize popoverController;
@synthesize changepwd;

BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
bool edit;
NSString* memId;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
-(IBAction)update:(id)sender{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(scrollview.contentOffset.x,scrollview.contentOffset.y,1024,768)];
    [activeField resignFirstResponder];
    [self performSelector:@selector(updateDeffered) withObject:nil afterDelay:0.5];
}

-(void) loadForm:(NSDictionary *) jsonData{
    BOOL isEnable1 = FALSE,isEnable2 = FALSE;
    for (UIView *subView in self.view.subviews) {
        if (subView.tag > 400 & subView.tag < 499) { //radio button
            UIButton *button = (UIButton *) subView;
            [button addTarget:self action:@selector(buttonClicked:) forControlEvents:UIControlEventTouchUpInside];
            //@"radio_surface",@"radio_underground",@"radio_NA",@"radio_road",@"radio_rail",@"radio_ambulance",@"radio_air",@"radio_others",@"radio_yes",@"radio_no"
            if (button.tag == 401) {
                NSString *str = [jsonData valueForKey:@"radio_surface"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 402) {
                NSString *str = [jsonData valueForKey:@"radio_underground"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 403) {
                NSString *str = [jsonData valueForKey:@"radio_NA"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 404) {
                NSString *str = [jsonData valueForKey:@"radio_road"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 405) {
                NSString *str = [jsonData valueForKey:@"radio_rail"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 406) {
                NSString *str = [jsonData valueForKey:@"radio_ambulance"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 407) {
                NSString *str = [jsonData valueForKey:@"radio_air"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
            
            if (button.tag == 408) {
                NSString *str = [jsonData valueForKey:@"radio_others"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                    isEnable1 = YES;
                }
            }
            if (button.tag == 409) {
                NSString *str = [jsonData valueForKey:@"radio_yes"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                    isEnable2 = YES;
                }
            }
            if (button.tag == 410) {
                NSString *str = [jsonData valueForKey:@"radio_no"];
                if (str && [str isEqualToString:@"yes"]) {
                    [button setSelected:YES];
                }
            }
        }
        if ((subView.tag >=20 && subView.tag <=23 )||subView.tag == 10 || subView.tag == 99) {
            UITextField *textField = (UITextField *) subView;
            [textField setDelegate:self];
            if (textField.tag == 99) {
                if (isEnable1) {
                    [textField setEnabled:YES];
                    //data
                    NSString *str = [jsonData valueForKey:@"textfield_mode_of_transfer"];
                    if (str) {
                        [textField setText:str];
                    }

                }else{
                    [textField setEnabled:NO];
                }
                
            }
            if (textField.tag == 10) {
                if (isEnable2) {
                    [textField setEnabled:YES];
                    //data
                    NSString *str = [jsonData valueForKey:@"textfield_have_a_physical"];
                    if (str) {
                        [textField setText:str];
                    }

                }else{
                    [textField setEnabled:NO];
                }
            }
            //data
            if (subView.tag == 20) {
                NSString *str = [jsonData valueForKey:@"textfield_closest_medical_centre"];
                if (str) {
                    [textField setText:str];
                }
            }
            
            if (subView.tag == 21) {
                NSString *str = [jsonData valueForKey:@"textfield_medical_centre"];
                if (str) {
                    [textField setText:str];
                }
            }
            
            if (subView.tag == 22) {
                NSString *str = [jsonData valueForKey:@"textfield_frequency_of_commerical"];
                if (str) {
                    [textField setText:str];
                }
            }
            
            if (subView.tag == 23) {
                NSString *str = [jsonData valueForKey:@"textfield_light_duty_options"];
                if (str) {
                    [textField setText:str];
                }
            }
            
        }
        if (subView.tag>=500 && subView.tag<510) {
            UITextView *textView = (UITextView *) subView;
            [textView setDelegate:self];
            
            NSString *str = [jsonData valueForKey:@"textview_further_informations"];
            if (str) {
                [textView setText:str];
            }
        }
        if (subView.tag == 998) {
            for (UIView *subView2 in subView.subviews) {
                if (subView2.tag > 0) {
                    UITextField *temp = (UITextField *) subView2;
                    [temp setDelegate:self];
                    
                    if (subView2.tag == 13) {
                        NSString *str = [jsonData valueForKey:@"textfield_pharmacy_name"];
                        if (str) {
                            [temp setText:str];
                        }
                    }
                    if (subView2.tag == 14) {
                        NSString *str = [jsonData valueForKey:@"textfield_pharmacy_phone"];
                        if (str && ![str isEqual:[NSNull null]]) {
                            [temp setText:str];
                        }
                    }
                    if (subView2.tag == 15) {
                        NSString *str = [jsonData valueForKey:@"textfield_pharmacy_fax"];
                        if (str) {
                            [temp setText:str];
                        }
                    }
                    if (subView2.tag == 16) {
                        NSString *str = [jsonData valueForKey:@"textfield_pharmacy_tax"];
                        if (str) {
                            [temp setText:str];
                        }
                    }
                }
            }
        }
        if (subView.tag == 999) {
            for (UIView *view in subView.subviews) {
                for (UIView *subView2 in view.subviews) {
                    if (subView2.tag > 0) {
                        UITextField *temp = (UITextField *) subView2;
                        [temp setDelegate:self];
                        
                        //Data
                        if (subView2.tag == 1) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic1"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 3) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic2"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 5) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic3"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 7) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic4"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        
                        if (subView2.tag == 9) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic5"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 11) {
                            NSString *str = [jsonData valueForKey:@"textfield_Medic6"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 2) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber1"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 4) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber2"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        
                        
                        if (subView2.tag == 6) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber3"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 8) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber4"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 10) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber5"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                        if (subView2.tag == 12) {
                            NSString *str = [jsonData valueForKey:@"textfield_ContactNumber6"];
                            if (str) {
                                [temp setText:str];
                            }
                        }
                    }
                }
            }
        }
    }
}
-(void) buttonClicked:(UIButton *) button{
    [button setSelected:YES];

    if (button.tag == 410) {
        
    }
    if (activeField) {
        [activeField resignFirstResponder];
    }
    if (button.tag <=403) {
        for (int i = 401; i<= 403; i++) {
            if (i != button.tag) {
                UIButton *bt = (UIButton *) [self.view viewWithTag:i];
                [bt setSelected:FALSE];
            }
        }
    }
    
    if (button.tag >403 && button.tag <=408) {
        for (int i = 404; i<= 408; i++) {
            if (i != button.tag) {
                UIButton *bt = (UIButton *) [self.view viewWithTag:i];
                [bt setSelected:FALSE];
            }
        }
        
        UITextField *temp = (UITextField *)[self.view viewWithTag:99];
        if (button.tag == 408) {
            [temp setEnabled:YES];
        }else{
            if (temp.enabled) {
                [temp setEnabled:NO];
            }
        }
    }
    
    if (button.tag >408 && button.tag <= 410) {
        for (int i = 409; i<= 410; i++) {
            if (i != button.tag) {
                UIButton *bt = (UIButton *) [self.view viewWithTag:i];
                [bt setSelected:FALSE];
            }
        }
        UITextField *temp = (UITextField *)[self.view viewWithTag:10];
        if (button.tag == 410) {
            [temp setEnabled:YES];
        }else{
            if (temp.enabled) {
                [temp setEnabled:NO];
            }
        }
    }
}
-(void)updateDeffered{
    NSMutableDictionary* json = [[NSMutableDictionary alloc] init];
    [json setValue:name.text forKey:@"name"];
    [json setValue:IMA.text forKey:@"IMA"];
    [json setValue:address.text forKey:@"address"];
    [json setValue:sname.text forKey:@"sname"];
    [json setValue:code.text forKey:@"code"];
    [json setValue:smphone.text forKey:@"smphone"];
    [json setValue:email.text forKey:@"email"];
    [json setValue:username.text forKey:@"username"];
    [json setValue:smedic.text forKey:@"smedic"];
    [json setValue:phone.text forKey:@"phone"];
    [json setValue:insurer.text forKey:@"insurer"];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if (edit){
        [json setValue:employer.eid forKey:@"companyId"];
        [json setValue:memId forKey:@"memId"];
    }else{
        
        [json setValue:[defaults objectForKey:@"companyId"] forKey:@"companyId"];
        [json setValue:[defaults objectForKey:@"memId"] forKey:@"memId"];
    }
    [json setValue:username.text forKey:@"username"];
    
    //Add
    for (UIView *subView in self.view.subviews) {
        if (subView.tag > 400 & subView.tag < 499) { //radio button
            UIButton *button = (UIButton *) subView;
            if (button.selected) {
                [json setValue:@"yes" forKey:[setting_radio_button objectAtIndex:(subView.tag %401)]];
            }else{
                [json setValue:@"no" forKey:[setting_radio_button objectAtIndex:(subView.tag %401)]];
            }
        }
        if ((subView.tag >=20 && subView.tag <=23 )||subView.tag == 10 || subView.tag == 99) {
            UITextField *textField = (UITextField *) subView;
            if (subView.tag == 99) {
                [json setValue:textField.text forKey:[setting_textfield objectAtIndex:(0)]];
            }else{
                if (subView.tag == 10) {
                    [json setValue:textField.text forKey:[setting_textfield objectAtIndex:(1)]];
                }else{
                    [json setValue:textField.text forKey:[setting_textfield objectAtIndex:(subView.tag %20 + 2)]];
                }
            }
            
        }
        if (subView.tag>=500 && subView.tag<510) {
            UITextView *textView = (UITextView *) subView;
            [json setValue:textView.text forKey:[setting_textfield objectAtIndex:6]];
        }
        if (subView.tag == 998) {
            for (UIView *subView2 in subView.subviews) {
                if (subView2.tag > 0) {
                    UITextField *temp = (UITextField *) subView2;
                    [json setValue:temp.text forKey:[setting_subtextfield objectAtIndex:(subView2.tag - 1)]];
                }
            }
        }
        if (subView.tag == 999) {
            for (UIView *view in subView.subviews) {
                for (UIView *subView2 in view.subviews) {
                    if (subView2.tag > 0) {
                        UITextField *temp = (UITextField *) subView2;
                        [json setValue:temp.text forKey:[setting_subtextfield objectAtIndex:(subView2.tag - 1)]];
                    }
                }
            }
        }
    }
    
    //End
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    //NSLog(@"%@", [[jsonWriter stringWithObject:json]stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]);
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updateEmployer?data=%@&token=%@", (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),[defaults objectForKey:@"tokenUser"]] showAlert:YES];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    if ([retval isEqualToString:@"1"]){
        if (!edit)
            [defaults setValue:username.text forKey:@"username"];
    }
}
//#warning TODO: add special notes field in API calls: http://teambox.0171.com/projects/redimed/tasks/2584

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    if (nil==employer){
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        employer = [[[rteleEmployers alloc] init] loadDataWithId:[defaults objectForKey:@"companyId"]];
        name.text = employer.name;
        IMA.text = employer.IMA;
        address.text = employer.address;
        sname.text = employer.sname;
        code.text = employer.code;
        smphone.text = employer.smphone;
        email.text = employer.email;
        username.text = [defaults objectForKey:@"username"];
        smedic.text = employer.smedic;
        phone.text = employer.phone;
        insurer.text = employer.insurer;
        edit = false;
        memId = [defaults objectForKey:@"memId"];
        
        //
        [self loadForm:employer.dictJson];

    }else{
        edit = true;
        rteleDoctor *member = [[[rteleDoctors alloc] init] loadDataWithCompanyId:employer.eid];
        memId = member.mid;
        name.text = employer.name;
        IMA.text = employer.IMA;
        address.text = employer.address;
        sname.text = employer.sname;
        code.text = employer.code;
        smphone.text = employer.smphone;
        email.text = employer.email;
        username.text = member.username;
        smedic.text = employer.smedic;
        phone.text = employer.phone;
        insurer.text = employer.insurer;
        
        //
        [self loadForm:member.dictJson];
    }
    if (edit){
        changepwd.hidden = false;
    }else{
        changepwd.hidden = false;
//		changepwd.hidden = true;
    }
    [delegate hideActivityViewer];
    
    //// Register for the events
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(keyboardDidShow:) name: UIKeyboardDidShowNotification object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector (keyboardDidHide:) name: UIKeyboardDidHideNotification object:nil];
    
}
-(IBAction)changePass:(id)sender{
    if (edit){
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            UIViewController* test = [[UIViewController alloc] init];
            test.view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 400, 160)];
            [test.view setBackgroundColor:[UIColor whiteColor]];
            //[scrollview addSubview:imageView];
            UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,400 ,44)];
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
            UITextField* textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 63,200 ,30)];
            [textfield setBorderStyle:UITextBorderStyleRoundedRect];
            [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
            [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
            [textfield setSecureTextEntry:YES];
            textfield.tag = 100;
            [test.view addSubview:textfield];
            label = [[UILabel alloc] initWithFrame:CGRectMake(15, 105, 150, 35)];
            label.text = @"Confirm password:";
            [label setTextAlignment:NSTextAlignmentRight];
            [test.view addSubview:label];
            textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 108,200 ,30)];
            [textfield setBorderStyle:UITextBorderStyleRoundedRect];
            [textfield setSecureTextEntry:YES];
            [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
            [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
            textfield.tag = 200;
            [test.view addSubview:textfield];
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
    
    } // Huy Code edit = false;
    else {
        {
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
                label.text =  @"Old password:";
                [label setTextAlignment:NSTextAlignmentRight];
                [test.view addSubview:label];
                UITextField* textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 63,200 ,30)];
                [textfield setBorderStyle:UITextBorderStyleRoundedRect];
                [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
                [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
                [textfield setSecureTextEntry:YES];
                textfield.tag = 400;
                [test.view addSubview:textfield];
                
                label = [[UILabel alloc] initWithFrame:CGRectMake(15, 105, 150, 35)];
                label.text =  @"New password:";
                [label setTextAlignment:NSTextAlignmentRight];
                [test.view addSubview:label];
                textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 108, 200 ,30)];
                [textfield setBorderStyle:UITextBorderStyleRoundedRect];
                [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
                [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
                [textfield setSecureTextEntry:YES];
                textfield.tag = 100;
                [test.view addSubview:textfield];
                
                label = [[UILabel alloc] initWithFrame:CGRectMake(15, 150, 150, 35)];
                label.text = @"Confirm password:";
                [label setTextAlignment:NSTextAlignmentRight];
                [test.view addSubview:label];
                textfield = [[UITextField alloc] initWithFrame:CGRectMake(175, 150,200 ,30)];
                [textfield setBorderStyle:UITextBorderStyleRoundedRect];
                [textfield setSecureTextEntry:YES];
                [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
                [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
                textfield.tag = 200;
                [test.view addSubview:textfield];
                label = [[UILabel alloc] initWithFrame:CGRectMake(15, 190, 370, 35)];
                label.text = @"Please fill in new password and hit Change.";
                label.tag = 300;
                [label setTextAlignment:NSTextAlignmentCenter];
                [label setTextColor:[UIColor redColor]];
                [test.view addSubview:label];
                
                popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
                popoverController.delegate=self;
                popoverController.popoverContentSize=CGSizeMake(400, 250);
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
    }
    // End
}
-(void) backgroundButtonClicked:(UIButton *) button{
    [button removeFromSuperview];
}
-(IBAction)doChangePass:(id)sender{
// Huy code edit
    if(edit) {
        
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [UIView beginAnimations:nil context:nil];
            [UIView setAnimationDuration:0.5];
            [UIView commitAnimations];
            NSString *newpassword = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
            if ([((UITextField*)[popoverController.contentViewController.view viewWithTag:200]).text isEqualToString:newpassword]){
                UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
                
                UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
                CGRect frame = CGRectMake(0, 0, 400, 200);
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
    } // Huy Code
    else {
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [UIView beginAnimations:nil context:nil];
            [UIView setAnimationDuration:0.5];
            [UIView commitAnimations];
            NSString *newpassword = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
            NSString *oldPassword = ((UITextField*)[popoverController.contentViewController.view viewWithTag:400]).text;
            
            if([newpassword isEqualToString:@""]) {
                ((UILabel*)[popoverController.contentViewController.view viewWithTag:300]).text = @"Password do not empty.";
            }else if ([((UITextField*)[popoverController.contentViewController.view viewWithTag:200]).text isEqualToString:newpassword]){
                UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
                
                UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
                CGRect frame = CGRectMake(0, 0, 400, 200);
                activity.view.frame = frame;
                [activity.view setNeedsLayout];
                [popoverController.contentViewController.view insertSubview:activity.view atIndex:99999];
                
                //[self performSelector:@selector(doChangePassDeferred:) withObject:newpassword afterDelay:0.5];
                [self doChangePassDefferredComp:newpassword and:oldPassword];
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
    }
//    End
}
-(void)doChangePassDeferred:(NSString*) newpassword{
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updatePass?newpass=%@&id=%@&type=0&token=%@", newpassword,memId,[defaults valueForKey:@"tokenUser"]] showAlert:YES];
        
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            [popoverController dismissPopoverAnimated:YES];
        }else{
            [currentViewChange.superview removeFromSuperview];
            currentViewChange = nil;
        }
        //    [popoverController dismissPopoverAnimated:YES];
        
        if ([retval isEqualToString:@"1"]){
            //[defaults setValue:username.text forKey:@"username"];
        }
}

//  Huy function change Pass company
-(void) doChangePassDefferredComp:(NSString *) newpass and:(NSString *) oldpass{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/updatePassCompany?newpass=%@&id=%@&type=0&token=%@&oldpass=%@", newpass,memId,[defaults valueForKey:@"tokenUser"], oldpass]];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [popoverController dismissPopoverAnimated:YES];
    }else{
        [currentViewChange.superview removeFromSuperview];
        currentViewChange = nil;
    }
    //    [popoverController dismissPopoverAnimated:YES];
    
    if ([retval isEqualToString:@"failed"]){
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"Error" message:@"Old password enter don't match." delegate:nil cancelButtonTitle:nil otherButtonTitles:@"Ok", nil];
        [alertView show];
    } else if([retval isEqualToString:@"success"]) {
        UIAlertView *alertView = [[UIAlertView alloc] initWithTitle:@"Success" message:@"Update password success." delegate:nil cancelButtonTitle:nil otherButtonTitles:@"Ok", nil];
        [alertView show];
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
    
//    // Register for the events
//    [[NSNotificationCenter defaultCenter]
//     addObserver:self
//     selector:@selector (keyboardDidShow:)
//     name: UIKeyboardDidShowNotification
//     object:nil];
//    [[NSNotificationCenter defaultCenter]
//     addObserver:self
//     selector:@selector (keyboardDidHide:)
//     name: UIKeyboardDidHideNotification
//     object:nil];
    
    // Setup content size
//    scrollview.contentSize = CGSizeMake(SCROLLVIEW_CONTENT_WIDTH,
//                                        SCROLLVIEW_CONTENT_HEIGHT);
//    [scrollview setContentSize:CGSizeMake(SCROLLVIEW_CONTENT_WIDTH, SCROLLVIEW_CONTENT_HEIGHT)];
//    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
}

-(void)viewDidLayoutSubviews{
    [super viewDidLayoutSubviews];
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [scrollview setContentSize:CGSizeMake(SCROLLVIEW_CONTENT_WIDTH, SCROLLVIEW_CONTENT_HEIGHT)];

    }else{
        [scrollview setContentSize:CGSizeMake(self.view.frame.size.width, 1800)];
    }
//    [scrollview setContentSize:CGSizeMake(SCROLLVIEW_CONTENT_WIDTH, SCROLLVIEW_CONTENT_HEIGHT)];
}

-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
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
    datepick.hidden = true;
    // Keyboard is no longer visible
    keyboardVisible = NO;
    
}

-(BOOL) textViewShouldBeginEditing:(UITextView *)textView{
    activeView = textView;
    if (208<activeView.frame.origin.y){
        [scrollview setContentOffset:CGPointMake(0, (activeView.frame.origin.y - (768-352)/2)) animated:YES];
    }else{
        [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
        
    }
    datepick.hidden = FALSE;
    
    return YES;
}
-(BOOL) textFieldShouldBeginEditing:(UITextField*)textField {
    activeField = textField;
    if (activeField.superview.tag == 998) {
        //        CGFloat y = [[activeField superview] superview].frame.origin.y + activeField.superview.frame.origin.y + activeField.frame.origin.y + 200;
        CGFloat y = activeField.frame.origin.y + activeField.superview.frame.origin.y + activeField.superview.superview.frame.origin.y;
        if (208<(y+activeField.frame.origin.y)){
            [scrollview setContentOffset:CGPointMake(0, (y+activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
        
        return YES;
    }
    
    if (activeField.superview.superview.tag == 999 || activeField.superview.superview.tag == 998) {
        //        CGFloat y = [[activeField superview] superview].frame.origin.y + activeField.superview.frame.origin.y + activeField.frame.origin.y + 200;
        CGFloat y = activeField.frame.origin.y + activeField.superview.frame.origin.y + activeField.superview.superview.frame.origin.y + activeField.superview.superview.superview.frame.origin.y;
        if (208<(y+activeField.frame.origin.y)){
            [scrollview setContentOffset:CGPointMake(0, (y+activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
        
        return YES;
    }
    //
    if (208<activeField.frame.origin.y){
        [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
    }else{
        [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
        
    }
    datepick.hidden = FALSE;
    //NSLog(@"%f",(activeField.frame.origin.y));
    return YES;
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

-(IBAction)chooseDate:(id)sender{
    UIDatePicker *picker = (UIDatePicker *) sender;
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"dd/MM/yyyy"];
    activeField.text = [format stringFromDate:picker.date];
}



@end
