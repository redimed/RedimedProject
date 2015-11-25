//
//  rteleFormS2bController.h
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <QuartzCore/QuartzCore.h>
#import "rteleEntry.h"
@class rteleHorizontalCollectionViewController;
@interface rteleFormS2bController : LandscapeOnlyUIViewController <UITableViewDelegate, UITableViewDataSource>{
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
@property (nonatomic,retain) IBOutlet UITextField *medtext;
@property (nonatomic,retain) IBOutlet UITextField *gillnesstxt;
@property (nonatomic,retain) IBOutlet UITextField *hn;
@property (nonatomic,retain) IBOutlet UITextField *temp;
@property (nonatomic,retain) IBOutlet UITextField *rr;
@property (nonatomic,retain) IBOutlet UITextField *sao2;
@property (nonatomic,retain) IBOutlet UITextField *bp;
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

@property (nonatomic, retain) NSArray *injury;
@property (nonatomic, retain) NSArray *arrays;
@property (nonatomic, retain) NSArray *injurysymptoms;
@property (nonatomic, retain) NSArray *sarrays;
@property (nonatomic, retain) NSArray *medicalhist;
@property (nonatomic, retain) NSArray *marrays;
@property (nonatomic, retain) NSMutableDictionary *images;
@property (nonatomic, retain) NSMutableDictionary *redflags;
@property (nonatomic, retain) NSMutableDictionary *imagesdata;

@property (nonatomic, weak) rteleHorizontalCollectionViewController *mcollectionViewController;

@property (nonatomic, retain) rteleEntry *entry;
@property (nonatomic, retain) NSString *employeeId;

@property BOOL edit;

@property (nonatomic, retain) NSMutableDictionary *data;
@property (strong) UIPopoverController *popoverController;
@property (nonatomic) CGFloat currentX;
@property (nonatomic) NSInteger currentIndex;
@property (nonatomic) NSInteger currentTag;
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
