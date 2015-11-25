//
//  rteleDrSettingsViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "rteleDoctor.h"
@interface rteleDrSettingsViewController : LandscapeOnlyUIViewController <UIImagePickerControllerDelegate, UINavigationControllerDelegate, UIPopoverControllerDelegate>{
    
    IBOutlet UIScrollView *scrollview;
    IBOutlet UITextField *activeField;
    rteleDoctor *doctor;
}
@property (nonatomic, retain) rteleDoctor *doctor;
@property (nonatomic,retain) IBOutlet UITextField *name;
@property (nonatomic,retain) IBOutlet UITextField *address;
@property (nonatomic,retain) IBOutlet UITextField *code;
@property (nonatomic,retain) IBOutlet UITextField *email;
@property (nonatomic,retain) IBOutlet UITextField *username;
@property (nonatomic,retain) IBOutlet UITextField *phone;
@property (nonatomic,retain) IBOutlet UITextField *prescriberNumber;

@property (nonatomic,retain) IBOutlet UIImageView *sign;
@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;

@property (strong) UIPopoverController *popoverController;
-(IBAction)update:(id)sender;
-(IBAction)changePass:(id)sender;
@end
