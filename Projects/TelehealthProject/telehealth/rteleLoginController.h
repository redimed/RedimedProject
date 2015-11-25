//
//  rteleLoginController.h
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@protocol loginDelegate;
@interface rteleLoginController : LandscapeOnlyUIViewController {
    IBOutlet UITextField *username;
    IBOutlet UITextField *passwd;
    IBOutlet UILabel *status;
    IBOutlet UIScrollView *scrollview;
    IBOutlet UITextField *activeField;
}
@property (nonatomic,assign) id <loginDelegate> delegate;
@property (nonatomic, retain) UITextField *username;
@property (nonatomic, retain) UITextField *passwd;
@property (nonatomic,retain) UILabel *status;

@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;


-(IBAction)checkUser:(id)sender;

-(IBAction)termandpolicy:(id)sender;
-(IBAction)policyClicked:(id)sender;

@end
@protocol loginDelegate

// By default, methods are "required"; you can change this by prefacing methods with "@optional"
- (void) didLogin:(rteleLoginController *)rteleLoginController withType:(NSString *)type;

@end