//
//  rteleDoctorFormViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleDoctorFormViewController.h"
#import "rteleAppDelegate.h"
#import "constants.h"
#import "SBJson.h"
#import "NSDataAdditions.h"
@interface rteleDoctorFormViewController ()

@end

@implementation rteleDoctorFormViewController
@synthesize doctor;
@synthesize scrollview;
@synthesize name;
@synthesize address;
@synthesize code;
@synthesize email;
@synthesize username;
@synthesize phone;
@synthesize sign;
@synthesize prescriberNumber;
@synthesize popoverController;
@synthesize pass;
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

#warning TODO: add presciber number field : http://teambox.0171.com/projects/redimed/tasks/2581
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
    [json setValue:address.text forKey:@"address"];
    [json setValue:code.text forKey:@"code"];
    [json setValue:email.text forKey:@"email"];
    [json setValue:username.text forKey:@"username"];
    [json setValue:phone.text forKey:@"phone"];
    [json setValue:pass.text forKey:@"password"];
    [json setValue:username.text forKey:@"username"];
    //NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [json setValue:@"99999" forKey:@"companyId"];
    [json setValue:@"1" forKey:@"type"];
    NSData *imagedata=[NSData dataWithData:UIImagePNGRepresentation(sign.image)];
    NSString *base64string = [imagedata base64Encoding];
    
    [json setValue:base64string forKey:@"drsign"];
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    //NSLog(@"%@", [[jsonWriter stringWithObject:json]stringByAddingPercentEscapesUsingEncoding: NSASCIIStringEncoding]);
    NSString *post = [NSString stringWithFormat:@"data=%@",
                      (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
    
//    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/addDoctor" postData:post showAlert:YES];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    
    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/addDoctor/?token=%@",[defaults objectForKey:@"tokenUser"]] postData:post showAlert:YES];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    if ([retval isEqualToString:@"1"]){
        [self goBackHome];
    }
}
-(IBAction)startCamera:(id)sender{
    [activeField resignFirstResponder];
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
    }else{
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
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
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
//                                            self.view.frame.size.width * 3);
//    }
    
    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
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
    }else{
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, 200) animated:YES];
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
