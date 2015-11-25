//
//  rteleSettingsViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "rteleEmployer.h"
@interface rteleSettingsViewController : LandscapeOnlyUIViewController <UIPopoverControllerDelegate>{
    
    IBOutlet UIScrollView *scrollview;
    UITextField *activeField;
    UITextView *activeView;
    UIDatePicker * datepick;
    rteleEmployer *employer;
}
@property (nonatomic, retain) rteleEmployer *employer;
@property (nonatomic,retain) IBOutlet UITextField *name;
@property (nonatomic,retain) IBOutlet UITextField *IMA;
@property (nonatomic,retain) IBOutlet UITextField *address;
@property (nonatomic,retain) IBOutlet UITextField *sname;
@property (nonatomic,retain) IBOutlet UITextField *code;
@property (nonatomic,retain) IBOutlet UITextField *smphone;
@property (nonatomic,retain) IBOutlet UITextField *email;
@property (nonatomic,retain) IBOutlet UITextField *username;
@property (nonatomic,retain) IBOutlet UITextField *smedic;
@property (nonatomic,retain) IBOutlet UITextField *phone;
@property (nonatomic,retain) IBOutlet UITextField *specialNotes;
@property (nonatomic,retain) IBOutlet UITextField *insurer;
@property (nonatomic,retain) IBOutlet UIButton *changepwd;

@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;

@property (strong) UIPopoverController *popoverController;
-(IBAction)update:(id)sender;
-(IBAction)changePass:(id)sender;
@end
