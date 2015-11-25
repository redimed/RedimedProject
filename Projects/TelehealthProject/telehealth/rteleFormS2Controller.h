//
//  rteleFormS2Controller.h
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "rteleEntry.h"
@class rteleHorizontalCollectionViewController;
@interface rteleFormS2Controller : LandscapeOnlyUIViewController <UITableViewDelegate, UITableViewDataSource, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UIPopoverControllerDelegate>{
	IBOutlet UITableView *firstTable;
	IBOutlet UITableView *secondTable;
    IBOutlet UITableView *thirdTable;
    IBOutlet UITableView *fourthTable;
    IBOutlet UITableView *fifthTable;
    IBOutlet UIScrollView *scrollview;
    UITextField *activeField;
    UIDatePicker * datepick;
    NSMutableArray *reusableCells;
    rteleEntry *entry;
    NSString *employeeId;
    BOOL edit;
}
@property (nonatomic,retain) IBOutlet UITextField *adate;
@property (nonatomic,retain) IBOutlet UITextField *alocation;
@property (nonatomic,retain) IBOutlet UITextField *reason;
@property (nonatomic,retain) IBOutlet UITextField *mhistorytxt;
@property (nonatomic,retain) IBOutlet UITextField *injuretxt;
@property (nonatomic,retain) IBOutlet UITextField *injuredesctxt;
@property (nonatomic,retain) IBOutlet UITextField *bdyparttxt;
@property (nonatomic,retain) IBOutlet UITextField *medication;
@property (nonatomic,retain) IBOutlet UITextField *allergies;
//huy code
@property (nonatomic, retain) IBOutlet UIImageView *signtxt;
@property (nonatomic, retain) NSMutableDictionary *authens;
//end

@property (nonatomic, retain) NSMutableArray *reusableCells;
@property(nonatomic,retain) IBOutlet UIScrollView *scrollview;
@property (nonatomic, retain) IBOutlet UIDatePicker *datepick;
@property (strong) IBOutlet UITableView *firstTable;
@property (strong) IBOutlet UITableView *secondTable;
@property (strong) IBOutlet UITableView *thirdTable;
@property (strong) IBOutlet UITableView *fourthTable;
@property (strong) IBOutlet UITableView *fifthTable;
@property (nonatomic, retain) IBOutlet UISlider *islider;
@property (nonatomic, retain) IBOutlet UITextField *islidertext;

@property (nonatomic, strong) IBOutlet UIButton *cameraButton;

@property (nonatomic, retain) NSArray *injury;
@property (nonatomic, retain) NSArray *arrays;
@property (nonatomic, retain) NSArray *injurysymptoms;
@property (nonatomic, retain) NSArray *sarrays;
@property (nonatomic, retain) NSArray *medicalhist;
@property (nonatomic, retain) NSArray *marrays;
@property (nonatomic, retain) NSMutableDictionary *images;
@property (nonatomic, retain) NSMutableDictionary *imagesdata;

@property (nonatomic, retain) rteleHorizontalCollectionViewController *icollectionViewController;
@property (nonatomic, retain) rteleHorizontalCollectionViewController *mcollectionViewController;
@property (nonatomic, retain) rteleHorizontalCollectionViewController *scollectionViewController;

@property (nonatomic, retain) rteleEntry *entry;
@property (nonatomic, retain) NSString *employeeId;

@property (strong) UIPopoverController *popoverController;
@property (nonatomic, retain) NSMutableDictionary *data;
@property (nonatomic) CGFloat currentX;
@property (nonatomic) NSInteger currentIndex;

@property BOOL edit;

-(IBAction)startCamera:(id)sender;
-(IBAction)changeSlide:(id)sender;
-(IBAction)changeSlideText:(id)sender;
-(IBAction)submit:(id)sender;
- (IBAction)chooseDate:(id)sender;
- (IBAction)touchOut:(id)sender;
- (IBAction)segControlClicked:(id)sender;
@property (nonatomic, retain) UIToolbar *keyboardToolbar;

//-(void)resignKeyboard:(id)sender;
-(void)previousField:(id)sender;
-(void)nextField:(id)sender;
@end
