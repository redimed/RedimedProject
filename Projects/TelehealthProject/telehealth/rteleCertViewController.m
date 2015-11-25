//
//  rteleCertViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 26/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleCertViewController.h"
#import "rteleAppDelegate.h"
#import "constants.h"
@interface rteleCertViewController ()

@end

@implementation rteleCertViewController
@synthesize reportId;
@synthesize edetail;
@synthesize reportType;
@synthesize entryId;

-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
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
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
//    if ([[[NSUserDefaults standardUserDefaults] valueForKey:@"type"] isEqualToString:@"1"]) { //doctor
//        UIBarButtonItem *editBarButton = [[UIBarButtonItem alloc] initWithTitle:@"Edit" style:UIBarButtonItemStyleDone target:self action:@selector(editButtonClicked)];
//        self.navigationItem.rightBarButtonItem = editBarButton;
//    }
}

-(void) viewWillAppear:(BOOL)animated{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    edetail.delegate = self;
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    //Create a URL object.
    NSURL *URL = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@/?token=%@", entryId, reportType,reportId,[defaults objectForKey:@"companyId"],[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
    
    //URL Requst Object
//    NSURLRequest *requestObj = [NSURLRequest requestWithURL:URL];
//    NSLog(@"requestObj: %@", requestObj);
    NSMutableURLRequest *requestA = [NSMutableURLRequest requestWithURL:URL cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [requestA setValue:author_token forHTTPHeaderField:@"Authorization"];
    //Load the request in the UIWebView.
    [edetail loadRequest:requestA];

}
- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    NSLog(@"here");
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

-(void) editButtonClicked{
    NSLog(@"\n %s \n",__func__);
}
@end
