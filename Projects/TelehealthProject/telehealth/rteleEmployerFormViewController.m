//
//  rteleEmployerFormViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleEmployerFormViewController.h"
#import "constants.h"
#import "rteleAppDelegate.h"
#import "SBJson.h"

@interface rteleEmployerFormViewController ()

@end

@implementation rteleEmployerFormViewController

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
@synthesize insurer;
@synthesize specialNotes;
@synthesize pwd;
BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

#warning TODO: add special notes in API call: http://teambox.0171.com/projects/redimed/tasks/2584

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}
-(IBAction)add:(id)sender{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [activeField resignFirstResponder];
    [self performSelector:@selector(addDeffered) withObject:nil afterDelay:0.5];
}

-(void)addDeffered{
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
    [json setValue:username.text forKey:@"username"];
    [json setValue:pwd.text forKey:@"password"];
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    //NSLog(@"%@", [[jsonWriter stringWithObject:json]stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]);
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/addEmployer?data=%@&&token=%@", (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),[defaults valueForKey:@"tokenUser"]] showAlert:YES];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    if ([retval isEqualToString:@"1"]){
        [self.navigationController popViewControllerAnimated:YES];
    }
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
//    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        scrollview.contentSize = CGSizeMake(0,
                                            SCROLLVIEW_CONTENT_HEIGHT);
//    }else{
//        scrollview.contentSize = CGSizeMake(self.view.frame.size.height,
//                                            pwd.frame.size.height + pwd.frame.origin.y + 300);
//    }
    
    
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
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
    }
    
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
