//
//  rteleHomeViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "rteleLoginController.h"

#import <MessageUI/MessageUI.h>
#import <MessageUI/MFMessageComposeViewController.h>

@interface rteleHomeViewController : LandscapeOnlyUIViewController <loginDelegate, MFMessageComposeViewControllerDelegate>

-(IBAction)lockScreen;
-(IBAction)logOut:(id)sender;
//-(void)reloadData;
-(void)displayComposerSheet: (UIViewController *) source;

@end
