//
//  rteleEmployerFormViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "rteleEmployer.h"

@interface rteleEmployerFormViewController : LandscapeOnlyUIViewController{
    
    IBOutlet UIScrollView *scrollview;
    IBOutlet UITextField *activeField;
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
@property (nonatomic,retain) IBOutlet UITextField *pwd;

@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;
-(IBAction)add:(id)sender;


@end
