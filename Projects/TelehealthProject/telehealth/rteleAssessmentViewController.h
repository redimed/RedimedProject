//
//  rteleAssessmentViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "rteleEntry.h"
//#import "rteleEmployee.h"

@interface rteleAssessmentViewController : LandscapeOnlyUIViewController <UITextFieldDelegate, UIWebViewDelegate,UIPopoverControllerDelegate>{
    
    rteleEntry *entry;
    //rteleEmployee *employee;
    NSString *employeeId;
    NSMutableDictionary *webviews;
    NSMutableDictionary *webviewscontent;
    NSMutableDictionary *webviewscontentheight;
    CGFloat current_y;
    IBOutlet UITextField *activeField;
    int type;
    int state;
}
@property CGFloat current_y;
@property int type;
@property int state;
@property (nonatomic, retain) IBOutlet UITextField *activeField;
@property (nonatomic, strong) UITextView *activeView;
@property (nonatomic, retain) rteleEntry *entry;
//@property (nonatomic, retain) rteleEmployee *employee;
@property (nonatomic, retain) NSString *employeeId;
@property (nonatomic, retain) NSMutableDictionary *salut;
@property (nonatomic, retain) NSMutableDictionary *active;
@property (nonatomic, retain) NSMutableDictionary *buttons;
@property (nonatomic, retain) NSMutableDictionary *panelHeight;
@property (nonatomic, retain) NSMutableDictionary *loading;
@property NSInteger maxIndex;
@property (nonatomic, retain) NSMutableDictionary *webviews;
@property (nonatomic, retain) NSMutableDictionary *webviewscontent;
@property (nonatomic, retain) NSMutableDictionary *webviewscontentheight;
@property (nonatomic, retain) IBOutlet UIScrollView *edetail;
@property (nonatomic, retain) IBOutlet UIDatePicker *datepick;
@property (nonatomic, retain) IBOutlet UIDatePicker *timepick;

@property (nonatomic, retain) NSMutableDictionary *assessments;
@property (nonatomic, retain) NSMutableDictionary *passessments;
@property (nonatomic, retain) NSMutableDictionary *fassessments;
@property (nonatomic, retain) NSMutableDictionary *nsw_assessments;
@property (nonatomic, retain) NSMutableDictionary *qld_assessments;
@property (nonatomic, retain) NSMutableDictionary *tas_assessments;
@property (nonatomic, retain) NSMutableDictionary *vic_assessments;
@property (nonatomic, retain) NSMutableDictionary *nt_assessments;

//Add
@property (nonatomic, strong) NSMutableDictionary *sa_assessments;

@property (strong) UIPopoverController *popoverController;
@property (nonatomic, retain) UIButton * activebtn;

-(IBAction)toggle:(id)sender;
-(IBAction)submit:(id)sender;
- (IBAction)chooseDate:(id)sender;
- (IBAction)chooseTime:(id)sender;
-(IBAction)toggleCheckboxes:(id)sender;
@end