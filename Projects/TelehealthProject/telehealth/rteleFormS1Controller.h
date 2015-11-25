//
//  rteleFormS1Controller.h
//  telehealth
//
//  Created by Khoa Nguyen on 7/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "rteleSignatureViewController.h"
#import "rteleEntry.h"
@class rteleHorizontalCollectionViewController;
@interface rteleFormS1Controller :  LandscapeOnlyUIViewController <UITextFieldDelegate, signPadDelegate>{
    IBOutlet UISegmentedControl *salutation;
    IBOutlet UIScrollView *scrollview;
    IBOutlet UITextField *activeField;
    UIDatePicker * datepick;
    rteleEntry *entry;
    NSString *employeeId;
    BOOL edit;
}
@property(nonatomic,retain) IBOutlet UISegmentedControl *salutation;
@property(nonatomic,retain) IBOutlet UISegmentedControl *relation;
@property(nonatomic,retain) IBOutlet UISegmentedControl *cholder;
@property(nonatomic,retain) IBOutlet UISegmentedControl *PHI;
@property(nonatomic,retain) IBOutlet UISegmentedControl *HC;
@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;
@property (nonatomic,retain) IBOutlet UITextField *fname;
@property (nonatomic,retain) IBOutlet UITextField *gname;
@property (nonatomic,retain) IBOutlet UITextField *dob;
@property (nonatomic,retain) IBOutlet UITextField *address;
@property (nonatomic,retain) IBOutlet UITextField *suburb;
@property (nonatomic,retain) IBOutlet UITextField *postcode;
@property (nonatomic,retain) IBOutlet UITextField *telhome;
@property (nonatomic,retain) IBOutlet UITextField *telwork;
@property (nonatomic,retain) IBOutlet UITextField *telmob;
@property (nonatomic,retain) IBOutlet UITextField *nok;
@property (nonatomic,retain) IBOutlet UITextField *telnok;
@property (nonatomic,retain) IBOutlet UITextField *medicare;
@property (nonatomic,retain) IBOutlet UITextField *medref;
@property (nonatomic,retain) IBOutlet UITextField *medexpiry;
@property (nonatomic,retain) IBOutlet UITextField *healthFund;
@property (nonatomic,retain) IBOutlet UITextField *memno;
@property (nonatomic,retain) IBOutlet UITextField *vano;
@property (nonatomic, retain) IBOutlet UIDatePicker *datepick;
@property (nonatomic, retain) NSMutableDictionary *authens;
@property (nonatomic, retain) NSMutableDictionary *data;
@property (nonatomic, retain) IBOutlet UIImageView *signtxt;

@property (nonatomic, retain) NSArray *servicerequired;
@property (nonatomic, retain) NSArray *servicerequired2;
@property (nonatomic, retain) NSArray *sarrays;
@property (nonatomic, retain) NSArray *sarrays2;

@property (nonatomic, weak) rteleHorizontalCollectionViewController *scollectionViewController;
@property (nonatomic, weak) rteleHorizontalCollectionViewController *scollectionViewController2;

@property (nonatomic, retain) rteleEntry *entry;
@property (nonatomic, retain) NSString *employeeId;
@property BOOL edit;

- (IBAction)chooseDate:(id)sender;
//- (IBAction)showDate;
- (IBAction)tapSignature:(UIGestureRecognizer *)sender;

- (IBAction)touchOut:(id)sender;
- (IBAction)submit:(id)sender;
-(IBAction)toggleCheckboxes:(id)sender;
//-(void)updateSignature;

@property (nonatomic, retain) UIToolbar *keyboardToolbar;

//-(void)resignKeyboard:(id)sender;
-(void)previousField:(id)sender;
-(void)nextField:(id)sender;

-(void) dataForView:(NSMutableDictionary *) dataForView entryID:(NSString *) entryId;
-(void) loadDataForView:(NSDictionary*) dataForView;
@end

