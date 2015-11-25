//
//  rteleAppDelegate.h
//  telehealth
//
//  Created by Khoa Nguyen on 24/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "rteleLoginController.h"

@interface rteleAppDelegate : UIResponder <UIApplicationDelegate,UIAlertViewDelegate>{
    IBOutlet UIWindow *window;
    UIView * activityView;
    UIViewController *spinning;
	bool activityvieweractive;
}

@property ( nonatomic) UIWindow *window;

-(IBAction)performLoginIfRequired: (UIViewController<loginDelegate> *) source;

-(void)hideActivityViewer;
-(void)showActivityViewer: (UIViewController *) source withFrame: (CGRect) frame;

@end
