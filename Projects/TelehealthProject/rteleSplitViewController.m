//
//  rteleSplitViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 2/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleSplitViewController.h"
#import "rteleEntries.h"
#import "rteleEmployees.h"
#import "rteleEntry.h"
#import "rteleAppDelegate.h"
#import "rteleReports.h"
#import "rteleAssessmentViewController.h"
#import "rteleCertsFunctionViewController.h"
#import "rteleFormS1Controller.h"
#import "constants.h"
#import "SBJson.h"
#import "rteleCertViewController.h"
#import "MBProgressHUD.h"
#import "CPPickerView/CPPickerView.h"

@interface rteleSplitViewController () <UIActionSheetDelegate, UIAlertViewDelegate, CPPickerViewDataSource, CPPickerViewDelegate>{
    //access
    NSArray *arrLabelForAccess;
    NSInteger currentIndexChosen;
    CPPickerView *pickerView;
    //end
    
    UIButton *backgroundView;
    NSInteger currentViewIndex;
    
    BOOL isSetValue;
}

@end

@implementation rteleSplitViewController
@synthesize entries;
@synthesize reports;
@synthesize searchBar;
@synthesize selectedIndex;
@synthesize tableview;
@synthesize active;
@synthesize buttons;
@synthesize maxIndex;
@synthesize panelHeight;
@synthesize salut;
@synthesize employeeId;
@synthesize loading;

@synthesize edetail;
@synthesize name;
@synthesize activebtn;
@synthesize webviews;
@synthesize webviewscontent;
@synthesize webviewscontentheight;
@synthesize current_y;
@synthesize popoverController;

@synthesize filteredEntries = filteredEntries;
@synthesize isFiltered = isFiltered;
@synthesize employee = employee;
@synthesize entry = entry;

@synthesize documents;

int type;
NSInteger state;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
        selectedIndex = nil;
        currentViewIndex = -1;
    }
    return self;
}
-(void)viewDidAppear:(BOOL)animated{
    [super viewDidAppear:animated];
    if ([[[NSUserDefaults standardUserDefaults] valueForKey:@"loadagain"] isEqualToString:@"1"]) {
        [self reloadData];
        [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"loadagain"];
    }
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    isSetValue = TRUE;
//    if ([[[NSUserDefaults standardUserDefaults] valueForKey:@"loadagain"] isEqualToString:@"1"]) {
//        [self reloadData];
//        [[NSUserDefaults standardUserDefaults] setValue:@"0" forKey:@"loadagain"];
//    }
    
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    
    if ([segue.identifier isEqualToString:@"assesssegue"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleAssessmentViewController *destViewController = segue.destinationViewController;
        destViewController.webviews = webviews;
        destViewController.webviewscontent = webviewscontent;
        destViewController.webviewscontentheight = webviewscontentheight;
        destViewController.current_y = current_y;
        destViewController.type = type;
        destViewController.entry = entry;
        destViewController.state = state;
    }
    if ([segue.identifier isEqualToString:@"certssegue"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleCertsFunctionViewController *destViewController = segue.destinationViewController;
        destViewController.employee = employee;
        destViewController.employeeId = employeeId;
        destViewController.entry = entry;
        destViewController.reports = reports;
        //NSLog(@"%@", entry.eid);
    }
    if ([segue.identifier isEqualToString:@"editentrysegue"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleFormS1Controller *destViewController = segue.destinationViewController;
        //destViewController.
        destViewController.employeeId = employeeId;
        destViewController.entry = entry;
        //NSLog(@"%d", type);
    }
    if ([segue.identifier isEqualToString:@"certviewsegue"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleCertViewController *destViewController = segue.destinationViewController;
        UIButton* btn = (UIButton*)sender;
        NSLog(@"%ld",(long)btn.tag);
        rteleReport *report = [reports objectAtIndex:currentViewIndex];
        destViewController.reportId = report.rid;
        destViewController.entryId = entry.eid;
        destViewController.reportType = report.type;
        currentViewIndex = -1;
    }
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    [self.name setFrame:CGRectMake(self.name.frame.origin.x, self.name.frame.origin.y, self.view.frame.size.height, self.name.frame.size.height)];
    [self setStyle];
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStylePlain target:nil action:nil]];
    arrLabelForAccess = [NSArray arrayWithObjects:@"NSW",@"NT",@"QLD",@"SA",@"TAS",@"VIC",@"WA", nil];
    //edetail.contentOffset = CGPointMake(10,10);
    searchBar.delegate = (id)self;
//    entries = [[[rteleEntries alloc] init] loadData:employeeId];
//    employee = [[[rteleEmployees alloc] init] loadDataWithId:employeeId];
//    if (0!=[entries count]){
//        [self performSelector:@selector(initData) withObject:nil afterDelay:0.5];
//        [tableview reloadData];
//    }
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        [edetail setFrame:CGRectMake(0, 0, self.view.frame.size.height, self.view.frame.size.width)];
        [edetail setContentSize:CGSizeMake(self.view.frame.size.height, self.view.frame.size.height * 2)];
    }
}
-(void)reloadData{
    
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        //Get doctor ID
        entries = [[[rteleEntries alloc] init] loadData:employeeId];
        employee = [[[rteleEmployees alloc] init] loadDataWithId:employeeId];
        if (0!=[entries count]){
            [self performSelector:@selector(initData) withObject:nil afterDelay:0.01];
            [tableview reloadData];
        }
        // Do something...
        [MBProgressHUD hideHUDForView:self.view animated:YES];
    });
    
    

}

-(void)initData{
    
    
    //rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    //[delegate showActivityViewer:self];
    //UIViews
    salut = [[NSMutableDictionary alloc] init];
    [salut setValue:@"Mr" forKey:@"1"];
    [salut setValue:@"Mrs" forKey:@"2"];
    [salut setValue:@"Ms" forKey:@"3"];
    [salut setValue:@"Miss" forKey:@"4"];
    [salut setValue:@"Master" forKey:@"5"];
    [salut setValue:@"Dr" forKey:@"6"];
    active = [[NSMutableDictionary alloc] init];
    panelHeight = [[NSMutableDictionary alloc] init];
    buttons = [[NSMutableDictionary alloc] init];
    loading = [[NSMutableDictionary alloc] init];
    webviews = [[NSMutableDictionary alloc] init];
    webviewscontent = [[NSMutableDictionary alloc] init];
    webviewscontentheight = [[NSMutableDictionary alloc] init];
    
    [tableview selectRowAtIndexPath:[NSIndexPath indexPathForRow:selectedIndex.row inSection:0] animated:YES scrollPosition:UITableViewScrollPositionNone];
    [self tableView:tableview didSelectRowAtIndexPath:[NSIndexPath indexPathForRow:selectedIndex.row inSection:0]];
}
-(IBAction)assessment:(id)sender{
    /*
    */
    
    NSDictionary *data = entry.detail;
    // add buttons
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
            if ([entry.status isEqualToString:@"2"]){
                UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Please choose a function for %@ %@",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]]
                                                                   delegate:self
                                                          cancelButtonTitle:@"Cancel"
                                                     destructiveButtonTitle:nil
                                                          otherButtonTitles:@"Certificate Functions", @"Request Progress Assessment", @"Edit", nil];
                sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
                sheet.tag = [entry.eid integerValue];
                [sheet showInView:self.view];
                
            }else{
                UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Please choose a function for %@ %@",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]]
                                                                   delegate:self
                                                          cancelButtonTitle:@"Cancel"
                                                     destructiveButtonTitle:nil
                                                          otherButtonTitles:@"Certificate Functions", @"Request Progress Assessment", @"Edit", nil];
                sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
                sheet.tag = [entry.eid integerValue];
                [sheet showInView:self.view];
            }
        }else{
            backgroundView = [UIButton buttonWithType:UIButtonTypeCustom];
            [backgroundView addTarget:self action:@selector(closeBackgroundButton) forControlEvents:UIControlEventTouchUpInside];
            [backgroundView setFrame:CGRectMake(0, 0, 1024, 768)];
            [backgroundView setBackgroundColor:[UIColor colorWithRed:220.0/255.0 green:220/255.0 blue:220/255.0 alpha:0.7]];
            [self.view addSubview:backgroundView];
            
            UIView *test = [[UIView alloc] initWithFrame:CGRectMake(174, 44, 800, 260)];
            [test setTag:9999];
            [test setBackgroundColor:[UIColor whiteColor]];
            [backgroundView addSubview:test];
            
            //[scrollview addSubview:imageView];
            UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,800 ,44)];
            toolbar.barStyle =UIBarStyleBlackTranslucent;
            UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Edit" style:UIBarButtonItemStyleBordered target:self action:@selector(doEdit:)];
            //toolbar.userInteractionEnabled = true;
            [test setUserInteractionEnabled:true];
            
            [cancel setTag:((UIButton*)sender).tag];
            UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Functions"
                                                                     style:UIBarButtonItemStylePlain
                                                                    target:nil
                                                                    action:nil];
            
            UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                                    target:nil
                                                                                    action:nil];
            
            
            // add fields
            UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(15, 58, 50, 35)];
            label.text =  @"State:";
            [label setTextAlignment:NSTextAlignmentRight];
            [test addSubview:label];
            label = [[UILabel alloc] initWithFrame:CGRectMake(15, 105, 200, 35)];
            label.text =  @"Please choose a function:";
            [label setTextAlignment:NSTextAlignmentRight];
            [test addSubview:label];
            
            NSArray *itemArray = [NSArray arrayWithObjects: @"NSW", @"NT",@"QLD", @"SA",@"TAS",@"VIC",@"WA", nil];
            UISegmentedControl *segmentedControl = [[UISegmentedControl alloc] initWithItems:itemArray];
            segmentedControl.frame = CGRectMake(85, 60, 700, 30);
            segmentedControl.segmentedControlStyle = UISegmentedControlStyleBar;
            segmentedControl.selectedSegmentIndex = 6;
            [segmentedControl setTag:-99];
            [test addSubview:segmentedControl];
            NSArray *items = nil;
            if ([[data objectForKey:@"itype"] isEqualToString:@"2"]){
                [test addSubview:[self addButtonWithImage:@"certfuncs_03.png" withRect:CGRectMake(35, 150, 207, 31) action:@selector(doClickAssessment:) withTag: -100]];
                [test addSubview:[self addButtonWithImage:@"firstcert_03.png" withRect:CGRectMake(35, 200, 207, 31) action:@selector(doClickAssessment:) withTag: -102]];
                [test addSubview:[self addButtonWithImage:@"progresscert_03.png" withRect:CGRectMake(280, 150, 207, 31) action:@selector(doClickAssessment:) withTag: -103]];
                [test addSubview:[self addButtonWithImage:@"finalcert_03.png" withRect:CGRectMake(280, 200, 207, 31) action:@selector(doClickAssessment:) withTag: -104]];
                [test addSubview:[self addButtonWithImage:@"generalcert_03.png" withRect:CGRectMake(525, 150, 207, 31) action:@selector(doClickAssessment:) withTag: -101]];
                //toolbar
                items = [[NSArray alloc] initWithObjects: spacer, item, spacer, nil];
            }else{
                
                [test addSubview:[self addButtonWithImage:@"certfuncs_03.png" withRect:CGRectMake(35, 150, 207, 31) action:@selector(doClickAssessment:) withTag: -100]];
                [test addSubview:[self addButtonWithImage:@"generalcert_03.png" withRect:CGRectMake(35, 200, 207, 31) action:@selector(doClickAssessment:) withTag: -102]];
                //toolbar
                items = [[NSArray alloc] initWithObjects: spacer, item, spacer, nil];
            }
            [toolbar setItems:items];
            [test addSubview:toolbar];
        }
    }else{
        if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]) {
            
        }else{
            backgroundView = [UIButton buttonWithType:UIButtonTypeCustom];
            [backgroundView addTarget:self action:@selector(closeBackgroundButton) forControlEvents:UIControlEventTouchUpInside];
            [backgroundView setFrame:CGRectMake(0, 0, 667, 375)];
            [backgroundView setBackgroundColor:[UIColor colorWithRed:220.0/255.0 green:220/255.0 blue:220/255.0 alpha:0.7]];
            [self.view addSubview:backgroundView];
            
            UIView *test = [[UIView alloc] initWithFrame:CGRectMake(60, 30, 380, 200)];
            [test setTag:9999];
            [test setBackgroundColor:[UIColor whiteColor]];
            [backgroundView addSubview:test];
            
            //[scrollview addSubview:imageView];
            UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,380 ,44)];
            toolbar.barStyle =UIBarStyleBlackTranslucent;
            UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Edit" style:UIBarButtonItemStyleBordered target:self action:@selector(doEdit:)];
            //toolbar.userInteractionEnabled = true;
            [test setUserInteractionEnabled:true];
            
            [cancel setTag:((UIButton*)sender).tag];
            UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Functions"
                                                                     style:UIBarButtonItemStylePlain
                                                                    target:nil
                                                                    action:nil];
            
            UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                                    target:nil
                                                                                    action:nil];
            
            //
            UILabel *stateLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 50, 60, 35)];
            [stateLabel setText:@"State: "];
            [stateLabel setTextAlignment:NSTextAlignmentLeft];
            [test addSubview:stateLabel];
            
//            pickerView = [[CPPickerView alloc] initWithFrame:CGRectMake(stateLabel.frame.origin.x + stateLabel.frame.size.width + 30, stateLabel.frame.origin.y, 250, 35)];
//            [pickerView setDataSource:self];
//            [pickerView setDelegate:self];
//            [pickerView setBackgroundColor:[UIColor whiteColor]];
//            [pickerView setAllowSlowDeceleration:YES];
//            pickerView.showGlass = YES;
//            pickerView.peekInset = UIEdgeInsetsMake(0, 35, 0, 35);
//            [pickerView reloadData];
//            [test addSubview:pickerView];
            
            NSArray *itemArray = [NSArray arrayWithObjects: @"NSW", @"NT",@"QLD", @"SA",@"TAS",@"VIC",@"WA", nil];
            UISegmentedControl *segmentedControl = [[UISegmentedControl alloc] initWithItems:itemArray];
            segmentedControl.frame = CGRectMake(stateLabel.frame.origin.x + stateLabel.frame.size.width + 10, stateLabel.frame.origin.y, test.frame.size.width - (stateLabel.frame.origin.x + stateLabel.frame.size.width + 20) , 35);
            segmentedControl.segmentedControlStyle = UISegmentedControlStyleBar;
            segmentedControl.selectedSegmentIndex = 6;
            [segmentedControl setTag:-99];
            [test addSubview:segmentedControl];
            
            
            stateLabel = [[UILabel alloc] initWithFrame:CGRectMake(20, 80, 250, 35)];
            [stateLabel setText:@"Please choose a function:"];
            [test addSubview:stateLabel];
            
            [stateLabel setTextAlignment:NSTextAlignmentLeft];
            NSArray *items = [NSArray arrayWithObjects:spacer, item, spacer, nil];
            [toolbar setItems:items];
            [test addSubview:toolbar];
            
            //button
            if ([[data objectForKey:@"itype"] isEqualToString:@"2"]){
                [test addSubview:[self addButtonWithImage:@"certfuncs_03.png" withRect:CGRectMake(20, stateLabel.frame.size.height + stateLabel.frame.origin.y + 10, 100, 31) action:@selector(doClickAssessment:) withTag: -100]];
                [test addSubview:[self addButtonWithImage:@"firstcert_03.png" withRect:CGRectMake(20, stateLabel.frame.size.height + stateLabel.frame.origin.y + 50, 100, 31) action:@selector(doClickAssessment:) withTag: -102]];
                [test addSubview:[self addButtonWithImage:@"progresscert_03.png" withRect:CGRectMake(130, stateLabel.frame.size.height + stateLabel.frame.origin.y + 10, 100, 31) action:@selector(doClickAssessment:) withTag: -103]];
                [test addSubview:[self addButtonWithImage:@"finalcert_03.png" withRect:CGRectMake(130, stateLabel.frame.size.height + stateLabel.frame.origin.y + 50, 100, 31) action:@selector(doClickAssessment:) withTag: -104]];
                [test addSubview:[self addButtonWithImage:@"generalcert_03.png" withRect:CGRectMake(240, stateLabel.frame.size.height + stateLabel.frame.origin.y + 10, 100, 31) action:@selector(doClickAssessment:) withTag: -101]];
                //toolbar
                items = [[NSArray alloc] initWithObjects: spacer, item, spacer, nil];
            }else{
                
                [test addSubview:[self addButtonWithImage:@"certfuncs_03.png" withRect:CGRectMake(35, stateLabel.frame.size.height + stateLabel.frame.origin.y + 10, 100, 31) action:@selector(doClickAssessment:) withTag: -100]];
                [test addSubview:[self addButtonWithImage:@"generalcert_03.png" withRect:CGRectMake(35, stateLabel.frame.size.height + stateLabel.frame.origin.y + 50, 100, 31) action:@selector(doClickAssessment:) withTag: -102]];
                //toolbar
                items = [[NSArray alloc] initWithObjects: spacer, item, spacer, nil];
            }
            
        }
    }
}

-(void) closeBackgroundButton{
    [backgroundView removeFromSuperview];
}
-(void) makeScreen{
    
    UIStoryboard *storyboard = [UIStoryboard storyboardWithName:@"MainStoryboard"
                                                         bundle: nil];
    
    rteleAssessmentViewController *destViewController = [storyboard instantiateViewControllerWithIdentifier:@"assessmentViewController"];
//    rteleAssessmentViewController *destViewController = [[rteleAssessmentViewController alloc] init];
    destViewController.webviews = webviews;
    destViewController.webviewscontent = webviewscontent;
    destViewController.webviewscontentheight = webviewscontentheight;
    destViewController.current_y = current_y;
    destViewController.type = type;
    destViewController.entry = entry;
    destViewController.state = state;
    [self.navigationController pushViewController:destViewController animated:YES];
//    [self presentViewController:destViewController animated:YES completion:nil];
}
-(IBAction)doClickAssessment:(id)sender{
//    UISegmentedControl *statesegment = ((UISegmentedControl*)[popoverController.contentViewController.view viewWithTag:-99]);
    UISegmentedControl *statesegment = ((UISegmentedControl*)[[backgroundView viewWithTag:9999] viewWithTag:-99]);
    UIButton *btn = ((UIButton*)sender);
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        state = statesegment.selectedSegmentIndex;
    }else{
        state = statesegment.selectedSegmentIndex;
    }
    
    switch (btn.tag) {
        case -100:
            [self performSegueWithIdentifier:@"certssegue" sender:sender];
            break;
        case -101:{
            type = 4;
            [self performSegueWithIdentifier:@"assesssegue" sender:sender];
            break;
        }

        case -102:
            type = 1;
            [self performSegueWithIdentifier:@"assesssegue" sender:sender];
            break;
        case -103:
            type = 2;
            [self performSegueWithIdentifier:@"assesssegue" sender:sender];
            break;
        case -104:
            type = 3;
            [self performSegueWithIdentifier:@"assesssegue" sender:sender];
            break;
        default:
            break;
    }
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    [self closeBackgroundButton];
//    [popoverController dismissPopoverAnimated:YES];
}

- (UIButton*)addButtonWithImage:(NSString*) image withRect: (CGRect) frame action:(SEL)action withTag:(NSInteger)tag{    // Method for creating button, with background image and other properties
    
    UIButton *playButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    playButton.frame = frame;
    UIImage *buttonImageNormal = [UIImage imageNamed:image];
    UIImage *strechableButtonImageNormal = [buttonImageNormal stretchableImageWithLeftCapWidth:12 topCapHeight:0];
    [playButton setBackgroundImage:strechableButtonImageNormal forState:UIControlStateNormal];
    [playButton addTarget:self action:action forControlEvents:UIControlEventTouchUpInside];
    [playButton setTag:tag];
    return playButton;
}
-(void)request:(id)sender{
    NSDictionary *data = entry.detail;
//    UIViewController* test = [[UIViewController alloc] init];
//    test.view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 800, 160)];
//    [test.view setBackgroundColor:[UIColor whiteColor]];
    
    backgroundView = [UIButton buttonWithType:UIButtonTypeCustom];
    [backgroundView setFrame:self.view.bounds];
    [backgroundView addTarget:self action:@selector(closeBackgroundButton) forControlEvents:UIControlEventTouchDown];
    [backgroundView setBackgroundColor:[UIColor colorWithRed:220.0/255.0 green:220/255.0 blue:220/255.0 alpha:0.7]];
    [self.view addSubview:backgroundView];
    
    UIView *testView = [[UIView alloc] initWithFrame:CGRectMake(0, 0, self.view.frame.size.width - 100, 300)];
    [testView setTag:1000];
    testView.center = CGPointMake(backgroundView.frame.size.width/2, backgroundView.frame.size.height/2);
    
    //[scrollview addSubview:imageView];
    UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,testView.frame.size.width ,44)];
    toolbar.barStyle =UIBarStyleBlackTranslucent;
    UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Send" style:UIBarButtonItemStyleBordered target:self action:@selector(doRequest:)];
    //toolbar.userInteractionEnabled = true;
    
    [cancel setTag:((UIButton*)sender).tag];
    UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Request progress assessment"
                                                             style:UIBarButtonItemStylePlain
                                                            target:nil
                                                            action:nil];
    
    UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                            target:nil
                                                                            action:nil];
    
    NSArray *items = [[NSArray alloc] initWithObjects:cancel, spacer, item, spacer, nil];
    
    [toolbar setItems:items];
    [testView addSubview:toolbar];
    // add fields
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(15, 60, 200, 35)];
    label.text =  @"Current symptoms/status:";
    [label setTextAlignment:NSTextAlignmentRight];
    [testView addSubview:label];
    UITextField* textfield = [[UITextField alloc] initWithFrame:CGRectMake(225, 63,350 ,30)];
    [textfield setBorderStyle:UITextBorderStyleRoundedRect];
    [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
    [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
    textfield.tag = 100;
    [testView addSubview:textfield];
    label = [[UILabel alloc] initWithFrame:CGRectMake(15, 105, 200, 35)];
    label.text = @"New symptoms:";
    [label setTextAlignment:NSTextAlignmentRight];
    [testView addSubview:label];
    textfield = [[UITextField alloc] initWithFrame:CGRectMake(225, 108,350 ,30)];
    [textfield setBorderStyle:UITextBorderStyleRoundedRect];
    [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
    [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
    textfield.tag = 200;
    [testView addSubview:textfield];
    label = [[UILabel alloc] initWithFrame:CGRectMake(15, 150, 200, 35)];
    if ([[data objectForKey:@"itype"] isEqualToString:@"2"])
        label.text = @"Issues with duties:";
    else
        label.text = @"Further information:";
    [label setTextAlignment:NSTextAlignmentRight];
    [testView addSubview:label];
    textfield = [[UITextField alloc] initWithFrame:CGRectMake(225, 154,350 ,30)];
    [textfield setBorderStyle:UITextBorderStyleRoundedRect];
    [textfield setAutocapitalizationType:UITextAutocapitalizationTypeNone];
    [textfield setAutocorrectionType:UITextAutocorrectionTypeNo];
    textfield.tag = 300;
    [testView addSubview:textfield];
    label = [[UILabel alloc] initWithFrame:CGRectMake(15, 195, 570, 35)];
    label.text = @"Please fill in the form and hit Send.";
    label.tag = 400;
    [label setTextAlignment:NSTextAlignmentCenter];
    [label setTextColor:[UIColor redColor]];
    [testView addSubview:label];
    
    [testView setBackgroundColor:[UIColor whiteColor]];
    [backgroundView addSubview:testView];
    
//    popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
//    popoverController.delegate=self;
//    popoverController.popoverContentSize=CGSizeMake(600, 250);
//    [popoverController presentPopoverFromRect:CGRectMake(600, 0, 5, 5) inView:self.view permittedArrowDirections:UIPopoverArrowDirectionUp animated:YES];
}
-(IBAction)doEdit:(id)sender{
    [self performSegueWithIdentifier:@"editentrysegue" sender:sender];
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    [popoverController dismissPopoverAnimated:YES];
    //[popoverController dismissPopoverAnimated:YES];
}
-(IBAction)doRequest:(id)sender{
    rteleAppDelegate *delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:self.view.bounds];
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.5];
    [UIView commitAnimations];
//    NSString *text1 = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
//    NSString *text2 = ((UITextField*)[popoverController.contentViewController.view viewWithTag:200]).text;
//    NSString *text3 = ((UITextField*)[popoverController.contentViewController.view viewWithTag:300]).text;
    
    NSString *text1 = ((UITextField*)[[backgroundView viewWithTag:1000] viewWithTag:100]).text;
    NSString *text2 = ((UITextField*)[[backgroundView viewWithTag:1000] viewWithTag:200]).text;
    NSString *text3 = ((UITextField*)[[backgroundView viewWithTag:1000] viewWithTag:300]).text;
    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
    
//    UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
//    CGRect frame = CGRectMake(0, 0, 600, 250);
//    activity.view.frame = frame;
//    [activity.view setNeedsLayout];
//    [popoverController.contentViewController.view insertSubview:activity.view atIndex:99999];
    
    NSMutableDictionary* json = [[NSMutableDictionary alloc] init];
    [json setValue:text1 forKey:@"text1"];
    [json setValue:text2 forKey:@"text2"];
    [json setValue:text3 forKey:@"text3"];
    
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    
    NSString *str = CFBridgingRelease(CFURLCreateStringByAddingPercentEscapes(NULL,(__bridge CFStringRef)([jsonWriter stringWithObject:json]),NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8));
    [self performSelector:@selector(doRequestDeferred:) withObject:str afterDelay:0.5];
    
    //[popoverController dismissPopoverAnimated:YES];
}
-(void)doRequestDeferred:(NSString*) str{
    
    
    //NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
//    NSString *post = [NSString stringWithFormat:@"data=%@&id=%@",str,entry.eid];
    NSString *post = [NSString stringWithFormat:@"data=%@&id=%@&employeeid=%@",str,entry.eid,self.employeeId];
    //NSLog(@"%@", post);
    
//    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/requestProgress" postData:post showAlert:YES];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    
    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/requestProgress/?token=%@",[defaults objectForKey:@"tokenUser"]] postData:post showAlert:YES];
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
//    [popoverController dismissPopoverAnimated:YES];
    [UIView animateWithDuration:0.2 animations:^{
        [backgroundView removeFromSuperview];
        backgroundView = nil;
        dispatch_queue_t myQueue = dispatch_queue_create("meditek.again", 0);
        dispatch_async(myQueue, ^{
            [self reloadData];
        });
        
    }];
    if ([retval isEqualToString:@"1"]){
        //[defaults setValue:username.text forKey:@"username"];
    }
}

-(void)actionSheet:(UIActionSheet *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex
{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    //[delegate showActivityViewer:self];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
        switch (buttonIndex) {
            case 0:
                [self performSegueWithIdentifier:@"certssegue" sender:actionSheet];
                
                break;
            case 1:
                [self request:actionSheet];
                break;
            case 2:
                [self performSegueWithIdentifier:@"editentrysegue" sender:actionSheet];
                break;
            default:
                [delegate hideActivityViewer];
                break;
        }
    }else{
        switch (buttonIndex) {
            case 0:
                [self performSegueWithIdentifier:@"certssegue" sender:actionSheet];
                
                break;
            case 1:
                type = 1;
                [self performSegueWithIdentifier:@"assesssegue" sender:actionSheet];
                break;
            case 2:
                type = 2;
                [self performSegueWithIdentifier:@"assesssegue" sender:actionSheet];
                break;
            case 3:
                if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"2"]){
                    type = 3;
                    [self performSegueWithIdentifier:@"assesssegue" sender:actionSheet];
                }else{
                    [delegate hideActivityViewer];
                }
                break;
            case 4:
                type = 4;
                [self performSegueWithIdentifier:@"assesssegue" sender:actionSheet];
                break;
            default:
                [delegate hideActivityViewer];
                break;
        }
    }
}
-(void)searchBar:(UISearchBar*)searchBar textDidChange:(NSString*)text
{
    if(text.length == 0)
    {
        isFiltered = FALSE;
    }
    else
    {
        isFiltered = TRUE;
        filteredEntries = [[NSMutableArray alloc] init];
        
        for (rteleEntry* entry2 in entries)
        {
            NSRange nameRange = [entry2.createdTime rangeOfString:text options:NSCaseInsensitiveSearch];
            NSRange descriptionRange = [entry2.createdTime rangeOfString:text options:NSCaseInsensitiveSearch];
            if(nameRange.location != NSNotFound || descriptionRange.location != NSNotFound)
            {
                [filteredEntries addObject:entry];
            }
        }
    }
    
    [tableview reloadData];
}
- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    NSInteger rowCount;
    if(isFiltered)
        rowCount = filteredEntries.count;
    else
        rowCount = entries.count;
    
    return rowCount;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    UITableViewCell *cell = [tableView
                             dequeueReusableCellWithIdentifier:@"EntryCell"];
    rteleEntry *eentry;
    if(isFiltered)
        eentry = [filteredEntries objectAtIndex:indexPath.row];
    else
        eentry = [entries objectAtIndex:indexPath.row];
    
    //rteleEntry *entry = [entries objectAtIndex:indexPath.row];
    if (![eentry.itype isEqual:[NSNull null]] && [eentry.itype isEqualToString:@"1"]){
        cell.textLabel.text = [NSString stringWithFormat:@"%@ - General illness",eentry.createdTime];
        //eentry.
        if ([eentry.status isEqualToString:@"1"])
            [cell.imageView setImage:[UIImage imageNamed:@"new.png"]];
        else
            [cell.imageView setImage:[UIImage imageNamed:@"check.png"]];
    }else{
        cell.textLabel.text = [NSString stringWithFormat:@"%@ - Injury",eentry.createdTime];
        
        if ([eentry.status isEqualToString:@"1"])
            [cell.imageView setImage:[UIImage imageNamed:@"new.png"]];
        else
            [cell.imageView setImage:[UIImage imageNamed:@"check.png"]];
    }
    return cell;
    
}


-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [self closeAllPanels];
    selectedIndex = indexPath;
    rteleAppDelegate * delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [self performSelector:@selector(showDetailsForIndexPath) withObject:nil afterDelay:0.5];
}

-(void) showDetailsForIndexPath
{
    
    rteleEntry* selectedEntry;
    
    if(isFiltered)
    {
        selectedEntry = [filteredEntries objectAtIndex:selectedIndex.row];
    }
    else
    {
        selectedEntry = [entries objectAtIndex:selectedIndex.row];
    }
    
    [self.searchBar resignFirstResponder];
    entry = [[[rteleEntries alloc] init] loadDataWithId:selectedEntry.eid];

    name.text = [NSString stringWithFormat:@"%@ %@",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]];
    [self populateData:entry forEmployee:employee];
    
}
-(void)populateData:(rteleEntry*)eentry forEmployee:(rteleEmployee*)eemployee{
    activebtn = nil;
    for(int i=1001; i<=maxIndex;i++){
        UIView *myView = [edetail viewWithTag:i];
        [myView removeFromSuperview];
    }
    [webviews removeAllObjects];
    [webviewscontent removeAllObjects];
    [webviewscontentheight removeAllObjects];
    reports = [[[rteleReports alloc] init] loadDataWithEntryId:eentry.eid];
    //NSLog(@"%d", [reports count]);
    // detail panel
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
//    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryDetail/%@/%@", eentry.eid, eentry.emid] relativeToURL:SITE_URL];
//    UIViewController* vc = [self duplicatePanel:1001 withLabel:@"Employer Details" withURL:[url absoluteString]];
    NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryDetail/%@/%@/?token=%@", eentry.eid, eentry.emid,[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
    UIViewController* vc = [self duplicatePanel:1001 withLabel:@"Employer Details" withURL:[url absoluteString]];
    
    [self.edetail addSubview:vc.view];
    
    CGRect frame = CGRectZero;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        frame = CGRectMake(13, 49, 700, 35);
    }else{
        frame = CGRectMake(13, 49, 440, 35);
    }
    vc.view.frame = frame;
    [buttons setValue:@"1001" forKey:@"2001"];
    [active setValue:@"0" forKey:@"1001"];
    [panelHeight setValue:@"43" forKey:@"1001"];
    [loading setValue:@"1" forKey:@"1001"];
    
    //Employee Setting
    url = [NSURL URLWithString:[NSString stringWithFormat:@"json/tienentryDetail/%@/%@/?token=%@",eentry.eid, eentry.emid,[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
    vc = [self duplicatePanel:1002 withLabel:@"Employer Setting" withURL:[url absoluteString]];
    [self.edetail addSubview:vc.view];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        frame = CGRectMake(13, 92, 700, 35);
    }else{
        frame = CGRectMake(13, 92, 440, 35);
    }
    vc.view.frame = frame;
    [buttons setValue:@"1002" forKey:@"2002"];
    [active setValue:@"0" forKey:@"1002"];
    [panelHeight setValue:@"43" forKey:@"1002"];
    [loading setValue:@"1" forKey:@"1002"];
    
    //End
    // injury desc panel
    
    url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryInjureDesc/%@/%@/?token=%@", eentry.eid, [defaults valueForKey:@"companyId"],[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
    
    vc = [self duplicatePanel:1003 withLabel:@"Injury Details" withURL:[url absoluteString]];
    [self.edetail addSubview:vc.view];
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        frame = CGRectMake(13, 135, 700, 35); //43 away
    }else{
        frame = CGRectMake(13, 135, 440, 35); //43 away
    }
    
    vc.view.frame = frame;
    
    maxIndex = 1003;
    [buttons setValue:@"1003" forKey:@"2003"];
    [active setValue:@"0" forKey:@"1003"];
    [panelHeight setValue:@"43" forKey:@"1003"];
    [loading setValue:@"1" forKey:@"1003"];
    // progress updates panel
    int y = 135;
    if ([entry.detail objectForKey:@"requestProgress"] != nil){
//        /*NSURL **/url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryProgressUpdates/%@/%@", eentry.eid, [defaults valueForKey:@"companyId"]] relativeToURL:SITE_URL];
        
        url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryProgressUpdates/%@/%@/?token=%@", eentry.eid, [defaults valueForKey:@"companyId"],[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
        vc = [self duplicatePanel:1004 withLabel:@"Progress Updates" withURL:[url absoluteString]];
        [self.edetail addSubview:vc.view];
        
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            frame = CGRectMake(13, y+43, 700, 35); //43 away
        }else{
            frame = CGRectMake(13, y+43, 440, 35); //43 away
        }
        
        vc.view.frame = frame;
        
        maxIndex = 1004;
        [buttons setValue:@"1004" forKey:@"2004"];
        [active setValue:@"0" forKey:@"1004"];
        [panelHeight setValue:@"43" forKey:@"1004"];
        [loading setValue:@"1" forKey:@"1004"];
        y=y+43;
    }
    
    // first report
    
    maxIndex = maxIndex + 1;
    if ([eentry.status isEqualToString:@"2"]){
//        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryReport/%@/1", eentry.eid] relativeToURL:SITE_URL];
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryReport/%@/1/?token=%@", eentry.eid,[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
        NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
        [request setValue:author_token forHTTPHeaderField:@"Authorization"];
        vc = [self duplicatePanel:maxIndex withLabel:@"Initial Assessments" withURL:[url absoluteString]];
        [self.edetail addSubview:vc.view];
        NSLog(@"%@",[url absoluteString]);
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            frame = CGRectMake(13, y + 43, 700, 35); //43 away
        }else{
            frame = CGRectMake(13, y + 43, 440, 35); //43 away
        }
        
        vc.view.frame = frame;
        
        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
        [active setValue:@"0" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        [panelHeight setValue:@"43" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        y=y+43;
    }
    // reports not first one
    
    int k=1;

    
    for (rteleReport* report in reports){
        NSString *jsonString =report.detail;
        NSData *data = [jsonString dataUsingEncoding:NSUTF8StringEncoding];
        id json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        NSLog(@"%@",[json objectForKey:@"nameReport"]);
        NSString *title;
        if ([report.type isEqualToString:@"2"]) {
            if([[json objectForKey:@"nameReport"] isEqualToString: @"Progress Assessment"]) {
                title = [NSString stringWithFormat:@"Progress Assessment - %@",report.updatedTime];
            } else if([[json objectForKey:@"nameReport"] isEqualToString: @"General Assessment"]) {
                title = [NSString stringWithFormat:@"General assessment - %@",report.updatedTime];
            } else if([json objectForKey:@"nameReport"] == nil) {
                title = [NSString stringWithFormat:@"General assessment - %@",report.updatedTime];
            }
        }
        else {
            if ([report.type isEqualToString:@"1"]) {
                title = [NSString stringWithFormat:@"First assessment - %@",report.updatedTime];
            }else{
               title = [NSString stringWithFormat:@"Final assessment - %@",report.updatedTime];
            }
        }
        
//        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryReport/%@/%@/%@", eentry.eid, report.type, report.rid] relativeToURL:SITE_URL];
        NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/entryReport/%@/%@/%@/?token=%@", eentry.eid, report.type, report.rid,[defaults objectForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
        NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
        [request setValue:author_token forHTTPHeaderField:@"Authorization"];
        vc = [self duplicatePanelWithButton:(maxIndex+k) withLabel:title withURL:[url absoluteString] rowId:(k-1)];
        [self.edetail addSubview:vc.view];
        
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            frame = CGRectMake(13, y + 43*k, 700, 35); //43 away
        }else{
            frame = CGRectMake(13, y + 43*k, 440, 35); //43 away
        }
        
        vc.view.frame = frame;
        [buttons setValue:[NSString stringWithFormat:@"%ld",maxIndex+k] forKey:[NSString stringWithFormat:@"%ld",maxIndex+k+1000]];
        [active setValue:@"0" forKey:[NSString stringWithFormat:@"%ld",maxIndex+k]];
        [panelHeight setValue:@"43" forKey:[NSString stringWithFormat:@"%ld",maxIndex+k]];
        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",maxIndex+k]];
        k = k +1;
        NSLog(@"%@",[url absoluteString]);
    }
    current_y = y + 43*k;
    maxIndex = maxIndex + k - 1;
}

-(UIViewController*)duplicatePanelWithButton:(NSInteger)tag withLabel:(NSString*)labeltxt withURL:(NSString *)url rowId:(NSInteger) rowId{
    // Take ownership.
    UIViewController * viewController = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        viewController = [[UIViewController alloc] initWithNibName:@"panelsmall" bundle:nil];
    }else{
        viewController = [[UIViewController alloc] initWithNibName:@"panelsmall_iphone" bundle:nil];
    }
    [viewController.view setTag:tag];
    UIButton* button = (UIButton*)[viewController.view viewWithTag:200];
    [button addTarget:nil action:@selector(toggle:) forControlEvents:UIControlEventTouchDown];
    [button setTag:tag+1000];
    UILabel* temp = (UILabel*)[viewController.view viewWithTag:300];
    temp.text = labeltxt;
    UIWebView* webView = (UIWebView*)[viewController.view viewWithTag:400];
    webView.scrollView.scrollEnabled = NO;
    webView.scrollView.bounces = NO;
    webView.delegate = self;
    
    //view certificate
    UIButton *viewCertButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [viewCertButton setFrame:CGRectMake(button.frame.size.width - 140, 0, 50, button.frame.size.height)];
    [viewCertButton setImage:[UIImage imageNamed:@"search_magnifier"] forState:UIControlStateNormal];
    [viewCertButton addTarget:self action:@selector(viewAndSendCertificate:) forControlEvents:UIControlEventTouchUpInside];
    [viewCertButton setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    [viewCertButton setTag:(1000)];
    [viewCertButton.titleLabel setText:[NSString stringWithFormat:@"%ld",(long)rowId]];
    [viewCertButton.titleLabel setHidden:YES];
    [button addSubview:viewCertButton];
    // send certificate
    
    UIButton *sendCertButton = [UIButton buttonWithType:UIButtonTypeCustom];
    [sendCertButton setImage:[UIImage imageNamed:@"email_send"] forState:UIControlStateNormal];
    [sendCertButton addTarget:self action:@selector(viewAndSendCertificate:) forControlEvents:UIControlEventTouchUpInside];
    [sendCertButton setImageEdgeInsets:UIEdgeInsetsMake(4, 4, 4, 4)];
    [sendCertButton setFrame:CGRectMake(button.frame.size.width - 70, 0, 50, button.frame.size.height)];
    [sendCertButton setTag:(1000 + 1)];
    [sendCertButton.titleLabel setText:[NSString stringWithFormat:@"%ld",(long)rowId]];
    [sendCertButton.titleLabel setHidden:YES];
    NSNumber *companyId = [[NSUserDefaults standardUserDefaults] objectForKey:@"companyId"];
    if([companyId  intValue] == 99999) {
                [button addSubview:sendCertButton];
    }
    //end
    //Create a URL object.
    NSURL *URL = [NSURL URLWithString:url];
    
    //URL Requst Object
//    NSURLRequest *requestObj = [NSURLRequest requestWithURL:URL];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    //Load the request in the UIWebView.
    [webView loadRequest:request];
    
    [[[viewController.view  viewWithTag:999] layer] setCornerRadius:9.0];
    //set ground corners for view
    [[viewController.view  layer] setCornerRadius:12.0];
    [[viewController.view  layer] setBorderWidth:1.0];
    [[viewController.view  layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
    
    
    return viewController;
}

-(UIViewController*)duplicatePanel:(NSInteger)tag withLabel:(NSString*)labeltxt withURL:(NSString *)url{
    // Load MyView.nib into the myView outlet.
    // Take ownership.
    UIViewController * viewController = nil;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        viewController = [[UIViewController alloc] initWithNibName:@"panelsmall" bundle:nil];
    }else{
        viewController = [[UIViewController alloc] initWithNibName:@"panelsmall_iphone" bundle:nil];
    }
    [viewController.view setTag:tag];
    UIButton* button = (UIButton*)[viewController.view viewWithTag:200];
    [button addTarget:nil action:@selector(toggle:) forControlEvents:UIControlEventTouchDown];
    
    [button setTag:tag+1000];
    UILabel* temp = (UILabel*)[viewController.view viewWithTag:300];
    temp.text = labeltxt;
    UIWebView* webView = (UIWebView*)[viewController.view viewWithTag:400];
    webView.scrollView.scrollEnabled = NO;
    webView.scrollView.bounces = NO;
    webView.delegate = self;
    //Create a URL object.
    NSURL *URL = [NSURL URLWithString:url];
    
    //URL Requst Object
    //NSURLRequest *requestObj = [NSURLRequest requestWithURL:URL];
    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
    NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
    [request setValue:author_token forHTTPHeaderField:@"Authorization"];
    //Load the request in the UIWebView.
    [webView loadRequest:request];
    
    [[[viewController.view  viewWithTag:999] layer] setCornerRadius:9.0];
    //set ground corners for view
    [[viewController.view  layer] setCornerRadius:12.0];
    [[viewController.view  layer] setBorderWidth:1.0];
    [[viewController.view  layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
    
    
    return viewController;
}
- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    BOOL okay = true;
    NSString* key = [NSString stringWithFormat:@"%ld",(long)[webView superview].tag];
    
    [webviews setValue:[NSKeyedArchiver archivedDataWithRootObject:[webView superview]] forKey:key];
    NSString *content = [webView stringByEvaluatingJavaScriptFromString:@"document.documentElement.outerHTML;"];
    [webviewscontent setValue:content forKey:key];
    
    [loading setValue:@"0" forKey:key];
    //NSLog(@"key-%@",key);
    for(int i=1001; i<=maxIndex;i++){
        NSString *val =[NSString stringWithFormat:@"%d",i];
        
        if ([[loading objectForKey:val] isEqualToString:@"1"]){
            okay = FALSE;
            //NSLog(@"key2-%@",val);
            break;
        }
    }
    
    [webView stringByEvaluatingJavaScriptFromString:@"document.getElementsByTagName('body')[0].style.webkitTextSizeAdjust= '140%'"];
    int content_height = [[webView stringByEvaluatingJavaScriptFromString: @"document.getElementById(\"table\").offsetHeight;"] integerValue];
    CGRect rect = webView.frame;
    rect.size.height = content_height+105;
    webView.frame = rect;
    //NSLog(@"here %d", content_height);
    NSString* height = [NSString stringWithFormat:@"%d",content_height+105];
//    [webView setFrame:CGRectMake(webView.frame.origin.x, webView.frame.origin.y, webView.frame.size.width, content_height + 55)];
    if (isSetValue) {
        [panelHeight setValue:height forKey:key];
    }
    
    [webviewscontentheight setValue:height forKey:key];
    if (okay){
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        UIBarButtonItem *homeBtn = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
        // function button
        UIBarButtonItem *functionBtn = [[UIBarButtonItem alloc] initWithTitle:@"Functions" style:UIBarButtonItemStylePlain target:self action:@selector(assessment:)];
        self.navigationItem.rightBarButtonItems = [NSArray arrayWithObjects:homeBtn, functionBtn, nil];
    }
    //NSLog(@"%@",height);
}
-(void)closeAllPanels{
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.3];
    for(int i=1001; i<=maxIndex;i++){
        NSString *val = [buttons objectForKey:[NSString stringWithFormat:@"%d",i+1000]];
        UIView *myView = [edetail viewWithTag:[val integerValue]];
        
        if ([[active objectForKey:val] isEqualToString:@"1"]){
            [self toggle:(UIButton*)[myView viewWithTag:i+1000]];
        }
    }
    [UIView commitAnimations];
}
-(void)toggle:(id)sender{
    UIButton *button = (UIButton *)sender;
    isSetValue = FALSE;
    NSString *val = [buttons objectForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
    UIView *myView = [edetail viewWithTag:[val integerValue]];
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.3];
    UIView *image = [[myView viewWithTag:999] viewWithTag:1];
    //NSLog(@"%@ - %@", [active objectForKey:val], val);
    if ([[active objectForKey:val] isEqualToString:@"1"]){
        CGRect rect = CGRectMake(myView.frame.origin.x,myView.frame.origin.y,myView.frame.size.width ,35);
        myView.frame = rect;
        [active setValue:@"0" forKey:val];
        
        // move others down
        [self movePanelsFrom:([val integerValue]) up:YES];
        // change minus sign to plus
        rect = CGRectMake(0,image.frame.origin.y,image.frame.size.width ,image.frame.size.height);
        image.frame = rect;
        activebtn = nil;
    }else{
        CGRect rect = CGRectMake(myView.frame.origin.x,myView.frame.origin.y,myView.frame.size.width ,[[panelHeight objectForKey:val] floatValue]);
        myView.frame = rect;
        
        [active setValue:@"1" forKey:val];
        // move others down
        [self movePanelsFrom:([val integerValue]) up:NO];
        // change plus sign to minus
        rect = CGRectMake(-36,image.frame.origin.y,image.frame.size.width ,image.frame.size.height);
        image.frame = rect;
        activebtn = button;
        
        //New
        UIWebView* webView = (UIWebView*)[myView viewWithTag:400];
        [webView.superview setClipsToBounds:YES];
        [webView setFrame:CGRectMake(0, 35, myView.frame.size.width, myView.frame.size.height - 35)];
        webView.scrollView.scrollEnabled = NO;
        webView.scrollView.bounces = NO;
        

        //Create a URL object.
        NSString *url = [webView stringByEvaluatingJavaScriptFromString:@"window.location.href"];
        
        NSURL *URL = [NSURL URLWithString:url];
        //URL Requst Object
//        NSURLRequest *requestObj = [NSURLRequest requestWithURL:[NSURL URLWithString:url]];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:URL cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
        NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
        [request setValue:author_token forHTTPHeaderField:@"Authorization"];
        
        //Load the request in the UIWebView.
        [webView loadRequest:request];
    
        ///End
    }
    
    [UIView commitAnimations];
    
    
    //NSLog(@"%@ - %@", [active objectForKey:val], val);
}

-(void)movePanelsFrom:(NSInteger)index up:(BOOL)direction{
    NSInteger offset;
    if (direction){
        offset = -[[panelHeight objectForKey:[NSString stringWithFormat:@"%ld",(long)index]] floatValue];
    }else{
        offset = [[panelHeight objectForKey:[NSString stringWithFormat:@"%ld",(long)index]] floatValue];
    }
    UIView *myView = nil;
    CGFloat sum =0;
    //NSLog(@"%d",offset);
    CGRect currentRect;
    for(int i=index+1; i<=maxIndex;i++){
        myView = [edetail viewWithTag:i];
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDuration:0.3];
        
        CGRect rect = CGRectMake(myView.frame.origin.x,myView.frame.origin.y+offset,myView.frame.size.width ,myView.frame.size.height);
        myView.frame = rect;
        sum = sum + myView.frame.origin.y+myView.frame.size.height;
        currentRect = rect;
        [UIView commitAnimations];
    }
    if (index==maxIndex){
        //edetail.contentSize = CGSizeMake(0, [edetail viewWithTag:index].frame.origin.y+50 + ([edetail viewWithTag:index].frame.size.height));
        edetail.contentSize = CGSizeMake(0, edetail.contentSize.height + ([edetail viewWithTag:index].frame.size.height) + 50);
    }else{
        edetail.contentSize = CGSizeMake(0, currentRect.origin.y+currentRect.size.height+300);
    }
}

-(void)setStyle{
    for (UIView *subview in [edetail subviews]) {
        if (0!=subview.tag){
            //set ground corners for plus sign
            [[[subview viewWithTag:999] layer] setCornerRadius:9.0];
            //set ground corners for view
            [[subview layer] setCornerRadius:12.0];
            [[subview layer] setBorderWidth:1.0];
            [[subview layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
            /*// create a CAGradientLayer to draw the gradient on
            CAGradientLayer *layer = [CAGradientLayer layer];
            UIColor *color = [[UIColor alloc] initWithRed:250 green:250 blue:250 alpha:1];
            // get the RGB components of the color
            const CGFloat *cs = CGColorGetComponents(color.CGColor);
            
            // create the colors for our gradient based on the color passed in
            layer.colors = [NSArray arrayWithObjects:
                            (id)[color CGColor],
                            (id)[[UIColor colorWithRed:0.98f*cs[0]
                                                 green:0.98f*cs[1]
                                                  blue:0.98f*cs[2]
                                                 alpha:1] CGColor],
                            (id)[[UIColor colorWithRed:0.95f*cs[0]
                                                 green:0.95f*cs[1]
                                                  blue:0.95f*cs[2]
                                                 alpha:1] CGColor],
                            (id)[[UIColor colorWithRed:0.93f*cs[0]
                                                 green:0.93f*cs[1]
                                                  blue:0.93f*cs[2]
                                                 alpha:1] CGColor],
                            nil];
            
            // create the color stops for our gradient
            layer.locations = [NSArray arrayWithObjects:
                               [NSNumber numberWithFloat:0.0f],
                               [NSNumber numberWithFloat:0.49f],
                               [NSNumber numberWithFloat:0.51f],
                               [NSNumber numberWithFloat:1.0f],
                               nil];
            
            layer.frame = subview.bounds;
            [subview.layer insertSublayer:layer atIndex:0];*/
        }
        
    }
    
    
}

 // Override to support conditional editing of the table view.
- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
 // Return NO if you do not want the specified item to be editable.
    rteleEntry *eentry;
    if(isFiltered)
        eentry = [filteredEntries objectAtIndex:indexPath.row];
    else
        eentry = [entries objectAtIndex:indexPath.row];
    
    //rteleEntry *entry = [entries objectAtIndex:indexPath.row];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
        return NO;
    }else{
        if ([eentry.status isEqualToString:@"1"]){
            return YES;
        }else{
            return NO;
        }
    }
    
}

- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
	if (editingStyle == UITableViewCellEditingStyleDelete)
	{
		
        rteleEntry *eentry;
        if(isFiltered){
            eentry = [filteredEntries objectAtIndex:indexPath.row];
            [filteredEntries removeObjectAtIndex:indexPath.row];
        }else{
            eentry = [entries objectAtIndex:indexPath.row];
            [entries removeObjectAtIndex:indexPath.row];
        }
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
		
        NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/entryDelete/%@/?token=%@", eentry.eid,[defaults valueForKey:@"tokenUser"]] showAlert:YES];
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        
        if ([retval isEqualToString:@"1"]){
            [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:UITableViewRowAnimationFade];
        }
	}
}

- (NSIndexPath *)tableView:(UITableView *)tableView willSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    //[delegate showActivityViewer:self];
    return indexPath;
    
}
/*
 // Override to support rearranging the table view.
 - (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
 {
 }
 */

-(void) viewAndSendCertificate:(UIButton *) button{
    NSLog(@"\n %s \n",__func__);
    NSInteger index = (button.tag %1000) %2;
    currentViewIndex = [button.titleLabel.text integerValue];;
    
    switch (index) {
        case 0: //view
        {
            rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
            [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
            [self performSegueWithIdentifier:@"certviewsegue" sender:nil];
        }
            break;
            
        default:{ //send
            [self emailCert:nil];
        }
            break;
    }
}

-(NSData *)saveDocumentFileWithDocument:(NSString*)iURL withName:(NSString *)name1
{
    NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:iURL] options:NSDataReadingUncached error:nil];
    
    NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString  *documentsDirectory = [paths objectAtIndex:0];
    
    NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,name1];
    
    if([[NSFileManager defaultManager] createFileAtPath:filePath contents:data attributes:nil])
    {
        return [NSData dataWithContentsOfFile:filePath];
    }
    
    NSURL  *url = [NSURL URLWithString:iURL];
    NSData *urlData = [NSData dataWithContentsOfURL:url];
    if ( urlData )
    {
        NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
        NSString  *documentsDirectory = [paths objectAtIndex:0];
        
        NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,name1];
        [urlData writeToFile:filePath atomically:YES];
        //return [NSData dataWithContentsOfFile:filePath];
        return urlData;
    }
    
    return nil;
}
- (void)emailCert:(id)sender
{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [self performSelector:@selector(emailDefferred:) withObject:sender afterDelay:0.3];
}
-(void)emailDefferred:(id)sender{
    if ([MFMailComposeViewController canSendMail])
    {
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        NSData* pdfData=nil;//[defaults objectForKey:[NSString stringWithFormat:@"%d", btn.tag]];
        if (nil==pdfData){
            //            NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@",
            //                                               entry.eid,
            //                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag-1000]],
            //                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag]],
            //                                               [defaults objectForKey:@"companyId"]]
            //                                relativeToURL:SITE_URL];
            
            rteleReport *report = [reports objectAtIndex:currentViewIndex];
            NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@/?token=%@",
                                               entry.eid,
                                               report.type,
                                               report.rid,
                                               [defaults objectForKey:@"companyId"],[defaults objectForKey:@"tokenUser"]]
                                relativeToURL:[rteleWebserviceManager getURL]];
            NSMutableURLRequest *requestA = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
            NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
            [requestA setValue:author_token forHTTPHeaderField:@"Authorization"];
            pdfData = [self saveDocumentFileWithDocument:[url absoluteString] withName:[NSString stringWithFormat:@"%@_%@.pdf",entry.eid,report.type]];
            //[defaults setValue:[NSString stringWithFormat:@"%@_%@.pdf",entry.eid,[reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag-1000]]] forKey:[NSString stringWithFormat:@"%d", btn.tag]];
        }
        
        if (nil==pdfData){
            NSLog(@"error");
            
        }else{
            MFMailComposeViewController *mailer = [[MFMailComposeViewController alloc] init];
            mailer.mailComposeDelegate = self;
            [mailer setSubject:@"Certificate from REDiMED TELEHEALTH"];
            NSArray *toRecipients = [NSArray arrayWithObjects: nil];
            [mailer setToRecipients:toRecipients];
            [mailer addAttachmentData:pdfData mimeType:@"application/pdf" fileName:@"certificate.pdf"];
            NSString *emailBody = [NSString stringWithFormat:@"Attached file is certificate for %@ %@.",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]];
            [mailer setMessageBody:emailBody isHTML:NO];
            mailer.modalPresentationStyle = UIModalPresentationPageSheet;
            [self presentViewController:mailer animated:YES completion:nil];
        }
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
    }
    else
    {
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Failure"
                                                        message:@"You should add an Email Account to your device.\n Please check it again."
                                                       delegate:self
                                              cancelButtonTitle:@"OK"
                                              otherButtonTitles:nil];
        [alert show];
        
    }
}
#pragma mark - UIAlertViewDelegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
}

- (void)mailComposeController:(MFMailComposeViewController*)controller didFinishWithResult:(MFMailComposeResult)result error:(NSError*)error
{
    switch (result)
    {
        case MFMailComposeResultCancelled:
            NSLog(@"Mail cancelled: you cancelled the operation and no email message was queued.");
            break;
        case MFMailComposeResultSaved:
            NSLog(@"Mail saved: you saved the email message in the drafts folder.");
            break;
        case MFMailComposeResultSent:
            NSLog(@"Mail send: the email message is queued in the outbox. It is ready to send.");
            break;
        case MFMailComposeResultFailed:
            NSLog(@"Mail failed: the email message was not saved or queued, possibly due to an error.");
            break;
        default:
            NSLog(@"Mail not sent.");
            break;
    }
    // Remove the mail view
    [self dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark -
#pragma mark QLPreviewControllerDelegate methods


- (BOOL)previewController:(QLPreviewController *)controller shouldOpenURL:(NSURL *)url forPreviewItem:(id <QLPreviewItem>)item {
    
    return YES;
}


#pragma mark -
#pragma mark QLPreviewControllerDataSource methods
- (NSInteger) numberOfPreviewItemsInPreviewController: (QLPreviewController *) controller {
    
    return [documents count];
}

- (id <QLPreviewItem>) previewController: (QLPreviewController *) controller previewItemAtIndex: (NSInteger) index {
    
    return [NSURL URLWithString:[documents objectAtIndex:index]];
}

#pragma mark - CPPickerViewDataSource

- (NSInteger)numberOfItemsInPickerView:(CPPickerView *)pickerView
{
    return arrLabelForAccess.count;
}




- (NSString *)pickerView:(CPPickerView *)pickerView titleForItem:(NSInteger)item
{
    return [arrLabelForAccess objectAtIndex:item];
}




#pragma mark - CPPickerViewDelegate

- (void)pickerView:(CPPickerView *)pickerView didSelectItem:(NSInteger)item
{
    currentIndexChosen = item;
}


@end
