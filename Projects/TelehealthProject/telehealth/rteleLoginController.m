//
//  rteleLoginController.m
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleLoginController.h"
#import "rteleAppDelegate.h"
#import "rteleHomeViewController.h"
#import "constants.h"
#import "SBJson.h"
#import "rteleWebserviceManager.h"

@interface rteleLoginController ()<UIAlertViewDelegate>{
    int secondLeft;
    BOOL isReseting;
}

@end

@implementation rteleLoginController
@synthesize username, passwd, status;
@synthesize delegate;
@synthesize scrollview;
NSTimer * delayTimer;

BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
int buttontag;

-(void)viewDidLoad{
    [super viewDidLoad];
    
    NSLog(@"SizeView: %@",NSStringFromCGRect(self.view.frame));
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handShake) name:@"handshake" object:nil];
    // Register for the events
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector (keyboardDidShow:)
     name: UIKeyboardWillShowNotification
     object:nil];
    [[NSNotificationCenter defaultCenter] addObserver:self
     selector:@selector (keyboardDidHide:) name: UIKeyboardWillHideNotification
     object:nil];
    
    NSString* documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    documentsPath = [documentsPath stringByAppendingPathComponent:@"SERVERURL.plist"];
    
    NSString *isdelete = [[NSUserDefaults standardUserDefaults] valueForKey:@"deleteFile"];
    //delete file
    if (!isdelete && [[NSFileManager defaultManager] fileExistsAtPath:documentsPath]) {
        
        NSError *error = nil;
        [[NSFileManager defaultManager] removeItemAtPath:documentsPath error:&error];
        if (error) {
            [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"deleteFile"];
        }else{
            [[NSUserDefaults standardUserDefaults] setValue:@"1" forKey:@"deleteFile"];
        }
        
    }
}
-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"handshake" object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillHideNotification object:nil];
    [[NSNotificationCenter defaultCenter] removeObserver:self name:UIKeyboardWillShowNotification object:nil];
}
-(void)checkUser:(id)sender{
    
    rteleAppDelegate *appdelegate = [[UIApplication sharedApplication] delegate];
    [appdelegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    
    [username resignFirstResponder];
	[passwd resignFirstResponder];
    
    
    if (![delayTimer isValid]) {
        delayTimer = [NSTimer scheduledTimerWithTimeInterval: 0.2
                                                      target: self
                                                    selector:@selector(authenticate)
                                                    userInfo: nil
                                                     repeats:NO];
    } else {
        //NSLog(@"delayTimer invalid FOR SOME REASON");
        
    }
    
}

-(void) updateCounter{
    secondLeft--;
    if (secondLeft >0 && secondLeft < 5*60 && !isReseting) {
        isReseting = TRUE;
        //Expired & require a new token
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSLog(@"%@",[defaults valueForKey:@"username"]);
        
        dispatch_queue_t myQueue = dispatch_queue_create("hungcao.meditek", 0);
        dispatch_async(myQueue, ^{
            while (secondLeft>0 && secondLeft < 5*60 && isReseting) {
                NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/getTokenFromClient?username=%@&token=%@", [defaults valueForKey:@"username"],[defaults valueForKey:@"tokenUser"]]];
                if (retval != nil && ![retval isEqualToString:@""]) {
                    SBJsonParser *parser = [[SBJsonParser alloc] init];
                    NSDictionary* json = [[parser objectWithString:retval] copy];
                    if (json != nil) {
                        NSString *newToken = [json valueForKey:@"token"];
                        if (newToken != nil && ![newToken isEqualToString:@""]) {
                            NSLog(@"\nresetPassword\n");
                            [defaults setValue:newToken forKey:@"tokenUser"];
                            secondLeft = 15*60;
                            isReseting = FALSE;
                        }
                    }
                }
            }

        });
        
        //Parse json and update again token
    }
    if (secondLeft == 0) { //Show login again
        [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"The session has expired!\nPlease login again!" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
    }
}
-(void)authenticate{
    
    NSString *post = [[NSString alloc] initWithFormat:@"username=%@&password=%@",username.text,passwd.text];
    //EDITHERE
    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"authen/vuong_authenticate" postData:post];
//    retval = @"1";
    SBJsonParser *parser = [[SBJsonParser alloc] init];
    NSDictionary *result = [parser objectWithString:retval];
    
    if (![[result objectForKey:@"message"] isEqualToString:@"OK"]){
        status.text = @"Wrong username/password combination.";
        //NSLog(@"failed! %@", retval);
    }else{
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        [defaults setValue:@"TRUE" forKey:@"isLoggedIn"];
        //NSLog(@"failed! %@", retval);
//        NSArray* stringComponents = [retval componentsSeparatedByString:@"##"];
        if (![[result objectForKey:@"message"] isEqualToString:@"OK"]){
            status.text = @"Error with internet connection, please try again later.";
        }else{
//            [defaults setValue:[stringComponents objectAtIndex:0] forKey:@"companyId"];
//            [defaults setValue:[stringComponents objectAtIndex:1] forKey:@"memId"];
//            [defaults setValue:[stringComponents objectAtIndex:2] forKey:@"type"];
//#if LOGIN_HACK
//            [defaults setValue:@"1" forKey:@"type"];
//#endif
//            [defaults setValue:username.text forKey:@"username"];
            
            secondLeft = 15*60;
            //Token expire 15'
//            [NSTimer scheduledTimerWithTimeInterval:1.0f target:self selector:@selector(updateCounter) userInfo:nil repeats:YES];
            //End // 1- doctor, 0 - client, 2-admin
            
            [defaults setValue:[result objectForKey:@"token"] forKey:@"tokenUser"];
            [defaults setValue:[result objectForKey:@"companyId"] forKey:@"companyId"];
            [defaults setValue:[result objectForKey:@"memId"] forKey:@"memId"];
            [defaults setValue:[result objectForKey:@"type"] forKey:@"type"];
#if LOGIN_HACK
            [defaults setValue:@"1" forKey:@"type"];
#endif
            [defaults setValue:username.text forKey:@"username"];
            [self dismissViewControllerAnimated:YES completion:nil];
            
            [self.delegate didLogin:self withType:[defaults valueForKey:@"type"]];
        }
    }
    rteleAppDelegate* appdelegate = [[UIApplication sharedApplication] delegate];
    [appdelegate hideActivityViewer];
}

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
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
    NSLog(@"\nSizeInWill: %@",NSStringFromCGRect(self.view.frame));
    //NSLog(@"Registering for keyboard events");

    // Setup content size
    scrollview.contentSize = CGSizeMake(SCROLLVIEW_CONTENT_WIDTH,
                                        SCROLLVIEW_CONTENT_HEIGHT);
    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
    
#if AUTO_LOGIN
    [username setText:@"Belmont"];
    [passwd setText:@"redimed"];
#endif
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
- (IBAction)touchOut:(id)sender{
    //NSLog(@"touchesBegan:withEvent:");
    [activeField resignFirstResponder];
    //[self.view endEditing:YES];
    //[super touchesBegan:touches withEvent:event];
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
        [scrollview setContentOffset:CGPointMake(0, 50) animated:YES];
    }
    
    //NSLog(@"%f",(activeField.frame.origin.y));
    return YES;
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}
-(IBAction)policyClicked:(id)sender{
    UIView *eview = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 1024, 768)];
    UIColor *background = [[UIColor alloc] initWithPatternImage:[UIImage imageNamed:@"policybg.png"]];
    [eview setBackgroundColor:background];
    
    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(25+37, 25+100, 900, 550)];
    [webView setBackgroundColor:[UIColor whiteColor]];
    for (id subview in webView.subviews){
        if ([[subview class] isSubclassOfClass: [UIScrollView class]])
            ((UIScrollView *)subview).bounces = NO;
    }
    webView.scalesPageToFit = NO;
    webView.autoresizesSubviews = NO;
    [eview addSubview:webView];
    [self.scrollview addSubview:eview];
    NSURL *url = [NSURL URLWithString:@"http://telehealth.redimed.com.au/test/redimed/public_html/policy.php"];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [webView loadRequest:requestObj];
    
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    background = [[UIColor alloc] initWithPatternImage:[UIImage imageNamed:@"closebtn.png"]];
    [button setBackgroundColor:background];
    [button addTarget:self
               action:@selector(close:)
     forControlEvents:UIControlEventTouchDown];
    button.frame = CGRectMake(900+25+37+12, 100-12, 28, 28);
    [button addTarget:self action:@selector(close:) forControlEvents:UIControlEventTouchUpInside];
    [eview addSubview:button];
}
-(IBAction)termandpolicy:(id)sender{
    UIView *eview = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 1024, 768)];
    UIColor *background = [[UIColor alloc] initWithPatternImage:[UIImage imageNamed:@"policybg.png"]];
    [eview setBackgroundColor:background];
    
//    UIWebView *webView = [[UIWebView alloc] initWithFrame:CGRectMake(25+37, 25+100, 900, 550)];
    UIWebView *webView = [[UIWebView alloc] initWithFrame:self.view.bounds];
    
    [webView setBackgroundColor:[UIColor whiteColor]];
    for (id subview in webView.subviews){
        if ([[subview class] isSubclassOfClass: [UIScrollView class]])
            ((UIScrollView *)subview).bounces = NO;
    }
    webView.scalesPageToFit = NO;
    webView.autoresizesSubviews = NO;
    [eview addSubview:webView];
    [self.scrollview addSubview:eview];
    NSURL *url = [NSURL URLWithString:@"https://telehealth.redimed.com.au/telehealthweb/#/form"];
    NSURLRequest *requestObj = [NSURLRequest requestWithURL:url];
    [webView loadRequest:requestObj];
    
    
    UIButton *button = [UIButton buttonWithType:UIButtonTypeCustom];
    background = [[UIColor alloc] initWithPatternImage:[UIImage imageNamed:@"closebtn.png"]];
    [button setBackgroundColor:background];
    [button addTarget:self
               action:@selector(close:)
     forControlEvents:UIControlEventTouchDown];
    button.frame = CGRectMake(webView.frame.size.width-(40), 40, 28, 28);
    [button addTarget:self action:@selector(close:) forControlEvents:UIControlEventTouchUpInside];
    [eview addSubview:button];

}
- (void)webViewDidFinishLoad:(UIWebView *)webView {
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
}

-(BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType{
    return YES;
}
- (IBAction)close:(id)sender {
    UIView * webView = [(UIButton *)sender superview];
    [webView removeFromSuperview];
}

#pragma mark - UIAlertViewDelegate
- (void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    if (buttonIndex == 0) {
        [[NSNotificationCenter defaultCenter] postNotificationName:@"signout" object:nil];
    }
}


 -(IBAction)updateDatabase:(id)sender{
    NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:@"json/updateDatabase"];
    NSLog(@"%@",retval);
}

-(void)viewDidLayoutSubviews{
    [super viewDidLayoutSubviews];
    
    NSLog(@"GetFrame: %@",NSStringFromCGRect(self.view.bounds));
}


//
-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];

//    NSString* documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
//    documentsPath = [documentsPath stringByAppendingPathComponent:@"SERVERURL.plist"];
//    //
//    //Get URL
//    NSString *stringURL = nil;
//    NSString* documentsPath = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
//    documentsPath = [documentsPath stringByAppendingPathComponent:@"SERVERURL.plist"];
//    if ([[NSFileManager defaultManager] fileExistsAtPath:documentsPath]) {
//        NSDictionary *dict = [NSDictionary dictionaryWithContentsOfFile:documentsPath];
//        [[NSUserDefaults standardUserDefaults] setValue:[dict valueForKey:@"SERVER_URL"] forKey:@"SERVER_URL"];
//        stringURL = [dict valueForKey:@"SERVER_URL"];
//        if ([stringURL componentsSeparatedByString:@"https"].count > 1) {
            [NSURLConnection connectionWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:SITE_URL_IN_STRING]] delegate:self];
            
            //
//        }
//        
//    }
    
    //END
//    NSString *stringURL = [url absoluteString];
//    if ([stringURL componentsSeparatedByString:@"https"].count > 1) {
//        [NSURLConnection connectionWithRequest:[NSURLRequest requestWithURL:url] delegate:self];
//    }
}
- (void)connection:(NSURLConnection *)connection
willSendRequestForAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    
    if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust])
    {
        [[NSUserDefaults standardUserDefaults] setValue:@"1" forKey:@"ssl"];
        NSLog(@"Ignoring SSL");
        SecTrustRef trust = challenge.protectionSpace.serverTrust;
        NSURLCredential *cred;
        cred = [NSURLCredential credentialForTrust:trust];
        [challenge.sender useCredential:cred forAuthenticationChallenge:challenge];
        
        //show alert
        //[[[UIAlertView alloc] initWithTitle:nil message:@"Connected to SSL successful" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        return;
    }else{
        NSString *url = [[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"];
        [url stringByReplacingOccurrencesOfString:@"https" withString:@"http"];
        [[NSUserDefaults standardUserDefaults] setValue:url forKey:@"SERVER_URL"];
    }
}


- (BOOL)connection:(NSURLConnection *)connection canAuthenticateAgainstProtectionSpace:(NSURLProtectionSpace *)protectionSpace {
    return [protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust];
}

- (void)connection:(NSURLConnection *)connection didReceiveAuthenticationChallenge:(NSURLAuthenticationChallenge *)challenge {
    [challenge.sender useCredential:[NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust] forAuthenticationChallenge:challenge];
    [challenge.sender continueWithoutCredentialForAuthenticationChallenge:challenge];
}

-(void) handShake{
    NSString *url = [[NSUserDefaults standardUserDefaults] valueForKey:@"SERVER_URL"];
    NSString *sl = [[NSUserDefaults standardUserDefaults] valueForKey:@"ssl"];
    if ([url componentsSeparatedByString:@"https"].count > 1 && !sl) {
        [NSURLConnection connectionWithRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:url]] delegate:self];
    }
}
@end
