//
//  rteleHomeViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleHomeViewController.h"
#import "rteleAppDelegate.h"
#import "FBEncryptorAES.h"

@interface rteleHomeViewController ()

@end

@implementation rteleHomeViewController
- (void)lockScreen{
        rteleAppDelegate    * delegate = [[UIApplication sharedApplication] delegate];
        [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];

}
-(void)displayComposerSheet: (UIViewController *) source
{
    MFMessageComposeViewController *picker = [[MFMessageComposeViewController alloc] init];
    picker.messageComposeDelegate = self;
    
    picker.recipients = [NSArray arrayWithObject:@"cthung.it2013@gmail.com"];   // your recipient number or self for testing
    picker.body = @"test from TELEHEALTH";
    
    [self presentViewController:picker animated:YES completion:nil];
    NSLog(@"SMS fired");
}
- (void)messageComposeViewController:(MFMessageComposeViewController *)controller didFinishWithResult:(MessageComposeResult)result {
    //NSLog(@"%@", result);
    
    [controller dismissViewControllerAnimated:YES completion:nil];
    
}
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (void) didLogin:(rteleLoginController *)rteleLoginController withType:(NSString *)type{
    for (UIView *subview in [self.view subviews]) {
        if ([type isEqualToString:@"0"]){
            if(subview.tag == 100)
                subview.hidden = false;
            else
                subview.hidden = true;
        }
        if ([type isEqualToString:@"1"]){
            if(subview.tag == 101){
                subview.hidden = false;
            }else{
                subview.hidden = true;
            }
        }
        if ([type isEqualToString:@"2"]){
            if(subview.tag == 102){
                subview.hidden = false;
            }else{
                subview.hidden = true;
            }
            
        }
    }
}

- (void)viewDidLoad
{
    NSLog(@"\n 574875487");
    [super viewDidLoad];
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc]
                                               initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]];

	// Do any additional setup after loading the view.
    //Register a notification
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(logOut:) name:@"signout" object:nil];
}
-(void)dealloc{
    [[NSNotificationCenter defaultCenter] removeObserver:self name:@"signout" object:nil];
}

-(IBAction)logOut:(id)sender{
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:@"FALSE" forKey:@"isLoggedIn"];
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate performLoginIfRequired:self];
}
-(void)viewDidAppear:(BOOL)animated{
    NSLog(@"\n %s \n",__func__);
    [super viewDidAppear:animated];
	// Do any additional setup after loading the view.
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate performLoginIfRequired:self];
    //[self displayComposerSheet:self];
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

@end
