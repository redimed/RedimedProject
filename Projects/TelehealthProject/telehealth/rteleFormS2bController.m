//
//  rteleFormS2bController.m
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleFormS2bController.h"
#import "constants.h"
#import "SBJson.h"
#import "rteleAppDelegate.h"
#import "rteleImagePreviewViewController.h"
#import "rteleRedFlagsViewController.h"
#import "rteleHorizontalCollectionViewController.h"

//huy code
#import "rteleSignatureViewController.h"
//end
#import "NSDataAdditions.h"

@interface rteleFormS2bController () <UIPopoverControllerDelegate, UIImagePickerControllerDelegate, UINavigationControllerDelegate, UIAlertViewDelegate, UIGestureRecognizerDelegate>{
    UIViewController *currentViewController;
    BOOL isBad;
}

@property (nonatomic, strong) IBOutlet UIButton *cameraButton;
@end

@implementation rteleFormS2bController
@synthesize scrollview;
@synthesize datepick;
@synthesize mcollectionViewController;
@synthesize medicalhist;
@synthesize marrays;
@synthesize islider;
@synthesize islidertext;

@synthesize adate;
@synthesize medtext;
@synthesize gillnesstxt;
@synthesize hn;
@synthesize temp;
@synthesize rr;
@synthesize sao2;
@synthesize bp;
@synthesize data;
@synthesize popoverController;
@synthesize images;
@synthesize currentIndex;
@synthesize currentX;
@synthesize redflags;
@synthesize imagesdata;
@synthesize currentTag;
@synthesize entry;
@synthesize employeeId;
@synthesize edit;
@synthesize keyboardToolbar;
//huy code
@synthesize authens;
@synthesize signtxt;
//end
@synthesize reusableCells = reusableCells;
@synthesize firstTable = firstTable;
@synthesize secondTable = secondTable;
@synthesize thirdTable = thirdTable;
@synthesize fourthTable = fourthTable;
@synthesize fifthTable = fifthTable;

BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
NSInteger currentIndex;
NSMutableArray *selectArrayMedicalHistory;
//  huy code
BOOL didsign;
//end
#define nextActive [NSArray arrayWithObjects: @"24",@"49",@"43",@"44",@"45",@"46",@"47",@"48",@"51", nil]

- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if ([segue.identifier isEqualToString:@"mCollectionViewSegue"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        mcollectionViewController = destinationVC;
    }
}

NSDictionary* bodyparts = nil;
- (IBAction)submit:(id)sender{
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    data = [NSMutableDictionary dictionaryWithDictionary:[defaults valueForKey:@"postData"]];
    for (UIView *subview in [[self.scrollview viewWithTag:9999] subviews]) {
        /* do something with subview */
        
        if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
            UITextField *itemp = (UITextField *)subview;
            
            [data setValue:itemp.text forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        if ((30==subview.tag)){
            UISegmentedControl *itemp = (UISegmentedControl *)subview;
            if (1==itemp.selectedSegmentIndex)
                [data setValue:@"yes" forKey:[fields objectAtIndex:(subview.tag-1)]];
            else
                [data setValue:@"no" forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        
    }
    if (((1==((UISegmentedControl *)[[self.scrollview viewWithTag:9999] viewWithTag:(-37)]).selectedSegmentIndex)
         &&([((UITextField *)[[self.scrollview viewWithTag:9999] viewWithTag:(37)]).text isEqualToString:@""]))){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"You selected YES for Medications, please specify." message:@"" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        return;
    }
    
    if (
        ((1==((UISegmentedControl *)[[self.scrollview viewWithTag:9999] viewWithTag:(-38)]).selectedSegmentIndex)
         &&([((UITextField *)[[self.scrollview viewWithTag:9999] viewWithTag:(38)]).text isEqualToString:@""]))
        ){
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"You selected YES for Allergies, please specify." message:@"" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil];
        [alert show];
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        return;
    }
    //medical history table
    NSArray* selectedRows = [mcollectionViewController.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"mhistory-%ld",([iindexPath row]+1)]];
    }
    // body part tables
    selectedRows = [self.firstTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%ld",([iindexPath row]+1+0)]];
    }
    selectedRows = [self.secondTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%ld",([iindexPath row]+1+4)]];
    }
    selectedRows = [self.thirdTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%ld",([iindexPath row]+1+8)]];
    }
    selectedRows = [self.fourthTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%ld",([iindexPath row]+1+12)]];
    }
    selectedRows = [self.fifthTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%ld",([iindexPath row]+1+16)]];
    }
    //  huy code
    isBad = FALSE;
    for (NSString *key in [authens allKeys]){
        
        [data setValue:[authens objectForKey:key] forKey:[NSString stringWithFormat:@"authen-%d",([key intValue]-250)]];
        if ([[authens objectForKey:key] isEqualToString:@"off"]) {
            isBad = TRUE;
        }
    }
//    Huy edit insert Signature worker to databse for general illness
    NSString *signtext = [defaults objectForKey:@"signtxt"];
    
    if (signtext) {
        [data setValue:signtext forKey:@"signtxt"];
    }
//    End Huy edit
    
    if (!isBad) {
        if(didsign) {
            rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
            [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
            [activeField resignFirstResponder];
            
            [data setValue:@"1" forKey:@"itype"];
            [defaults setValue:data forKey:@"postData"];
            
            [self performSelector:@selector(updateDeffered) withObject:nil afterDelay:0.5];
        } else {
            [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"You must have your signature again. Please" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        }
    }else{
        [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"You must check all checkbox." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
    }
    //  end
}
-(void)updateDeffered{
    NSMutableDictionary* json = [[NSMutableDictionary alloc] init];
    
    for (NSString *key in [data allKeys]){
        [json setValue:[data objectForKey:key] forKey:key];
    }
    
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    for (NSString* key in [images allKeys]){
        NSData *imagedata=[NSData dataWithData:UIImageJPEGRepresentation([images valueForKey:key],1)];
        double compressionRatio=1;
        
        while ([imagedata length]>150000) {
            compressionRatio=compressionRatio*0.5;
            imagedata=UIImageJPEGRepresentation([images valueForKey:key],compressionRatio);
            // NSLog(@"%d", [imagedata length]);
            if (compressionRatio<=0.1 )
                break;
        }
        NSString *base64string = [imagedata base64Encoding];
        [imagesdata setValue:base64string forKey:key];
    }
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString *post;
    if (edit){
        post = [NSString stringWithFormat:@"data=%@&type=edit&companyId=%@&images=%@&allauthen=%@&redflags=%@&id=%@",
                      [jsonWriter stringWithObject:json],
                      [defaults objectForKey:@"companyId"],
                      [jsonWriter stringWithObject:imagesdata],
                      [defaults objectForKey:@"allauthen"],
                      [jsonWriter stringWithObject:redflags],entry.eid];
    }else{
        post = [NSString stringWithFormat:@"data=%@&type=add&companyId=%@&images=%@&allauthen=%@&redflags=%@",
                [jsonWriter stringWithObject:json],
                [defaults objectForKey:@"companyId"],
                [jsonWriter stringWithObject:imagesdata],
                [defaults objectForKey:@"allauthen"],
                [jsonWriter stringWithObject:redflags]];
    }
    //NSLog(@"%@", post);
    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/formSubmit/?token=%@",[defaults valueForKey:@"tokenUser"]] postData:post showAlert:NO];

    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];

    if ([retval isEqualToString:@"0"]) {
        [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your information and your network have some problem.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
    }else{
        if ([retval integerValue] > 0) {
            [[[UIAlertView alloc] initWithTitle:@"Success!" message:@"Added successfully to server." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        }else{
            [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your information and your network have some problem.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
        }
    }
    
//    if ([retval isEqualToString:@"1"]){
//        [[[UIAlertView alloc] initWithTitle:@"Success!" message:@"Added successfully to server." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//    }else{
//        [[[UIAlertView alloc] initWithTitle:@"Failed!" message:@"Your input and your network have some problem.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//    }
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    currentViewController = nil;
    
	// Do any additional setup after loading the view.
    [self setStyle];
    
//    currentX = 897;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        currentX = 897;
    }else{
        currentX = self.cameraButton.frame.size.width + self.cameraButton.frame.origin.x + 100;
    }
//    huy code
    authens = [[NSMutableDictionary alloc] init];
    [authens setValue:@"off" forKey:@"-250"];
    [authens setValue:@"off" forKey:@"-251"];
    [authens setValue:@"off" forKey:@"-252"];
    [authens setValue:@"off" forKey:@"-253"];
    didsign = FALSE;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(touchOut:)];
    [tap setCancelsTouchesInView:NO];
    [scrollview addGestureRecognizer:tap];
    
    UITapGestureRecognizer *signaturetap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapSignature:)];
    [signaturetap setNumberOfTouchesRequired:1];
    [signaturetap setNumberOfTapsRequired:1];
    [signaturetap setDelegate:self];
    [signtxt addGestureRecognizer:signaturetap];
    [signtxt setContentMode:UIViewContentModeScaleAspectFit];
    
//    end
    currentTag = 4000;
    datepick = [[UIDatePicker alloc] init];
    [datepick setDatePickerMode:UIDatePickerModeDate];
    [datepick addTarget:self action:@selector(chooseDate:) forControlEvents:UIControlEventValueChanged];
    adate.inputView = datepick;
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    //bodyparts = [[NSDictionary alloc] initWithObjectsAndKeys:@"Left lower leg", @"0",@"Right lower leg", @"1",@"Left upper leg","2",@"Right upper leg", @"3",@"Left lower arm", @"4",@"Left lower arm", @"5",@"Left upper arm", @"6",@"Right upper arm", @"7",@"Hendecagon", @"8",@"Dodecagon", @"9",nil];
    bodyparts = [[NSDictionary alloc] initWithObjectsAndKeys:
                 @"Headache", @"0",
                 @"Nausea", @"1",
                 @"Fatigue",@"2",
                 @"Fever", @"3",
                 @"Sore throat", @"4",
                 @"Cough", @"5",
                 @"Sinus congestion", @"6",
                 @"Body aches", @"7",
                 @"Vomiting", @"8",
                 @"Light headedness", @"9",
                 @"Diarrhea", @"10",
                 @"Shortness of breath", @"11",
                 @"Chest pain", @"12",
                 @"Abdomen pain", @"13",
                 @"Back pain", @"14",
                 @"Ear pain", @"15",
                 @"Low mood", @"16",
                 @"Decreased appetite", @"17",
                 @"Feeling depressed", @"18",
                 @"Tooth pain", @"19",
                 nil];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    data = [NSMutableDictionary dictionaryWithDictionary:[defaults valueForKey:@"postData"]];
    for (int i=1;i<=19; i++)
        [data setValue:@"off" forKey:[NSString stringWithFormat:@"gillness-%d",i]];
    [defaults setValue:data forKey:@"postData"];
    
    images = [[NSMutableDictionary alloc] init];
    imagesdata = [[NSMutableDictionary alloc] init];

    float sum = 0;
    medicalhist = [[NSArray alloc] initWithObjects:@"Asthma", @"Epilepsy", @"Heart condition", @"High cholesterol", @"Diabetes type I", @"Diabetes type II", @"High blood pressure", @"Arthritis", @"Blood condition", nil];
    sum = 0;
    for (NSString *str in medicalhist){
        CGFloat height = 20+ [str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height*1;
    }
    UIView *medicalView = [mcollectionViewController.collectionView.superview.superview superview];
    medicalView.frame = CGRectMake(medicalView.frame.origin.x, medicalView.frame.origin.y, sum, 30);
    marrays = [[NSArray alloc] initWithObjects:medicalhist, nil];
    selectArrayMedicalHistory = [[NSMutableArray alloc] initWithObjects:@"no", @"no", @"no",@"no",@"no",@"no",@"no",@"no",@"no", nil];
    redflags = [[NSMutableDictionary alloc] init];
    edit = FALSE;
    
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"dd/MM/yyyy"];
    
    //get the date today
    NSString *dateToday = [format stringFromDate:[NSDate date]];
    ((UITextField *)[[self.scrollview viewWithTag:9999] viewWithTag:28]).text = dateToday;
    [adate setText:dateToday];
    
    if (nil!=entry){
        edit = TRUE;
        if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"1"]){

            for (UIView *subview in [[self.scrollview viewWithTag:9999] subviews]) {
                /* do something with subview */
                //UITextField *field = (UITextField *)[self viewWithTag: tagValue];
                
                if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
                    UITextField *temp2 = (UITextField *)subview;
                    temp2.text = [entry.detail objectForKey:[fields objectAtIndex:(subview.tag-1)]];
                    if (subview.tag == 40){
                        [self changeSlideText:subview];
                    }
                }
                if ((30==subview.tag)){
                    UISegmentedControl *temp2 = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"hasbe4"] isEqualToString:@"on"]){
                        temp2.selectedSegmentIndex = 2;
                    }else{
                        temp2.selectedSegmentIndex = 1;
                    }
                }
                if ((-37==subview.tag)){
                    UISegmentedControl *temp2 = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"medication"] isEqualToString:@""]){
                        temp2.selectedSegmentIndex = 2;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:37]).enabled = false;
                    }else{
                        temp2.selectedSegmentIndex = 1;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:37]).enabled = true;
                    }
                }
                if ((-38==subview.tag)){
                    UISegmentedControl *temp2 = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"allergies"] isEqualToString:@""]){
                        temp2.selectedSegmentIndex = 2;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:38]).enabled = false;
                    }else{
                        temp2.selectedSegmentIndex = 1;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:38]).enabled = true;
                    }
                }
                
            }
            //medical history table
            for (int i=1;i<=[medicalhist count]; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"mhistory-%d",i]] isEqualToString:@"on"]){
                    [selectArrayMedicalHistory replaceObjectAtIndex:i-1 withObject:@"yes"];
                }
            }
            
            // body part tables
            for (int i=1;i<=4; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"gillness-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.firstTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-1 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=5;i<=8; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"gillness-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.secondTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-5 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=9;i<=12; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"gillness-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.thirdTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-9 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=13;i<=16; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"gillness-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.fourthTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-13 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=17;i<=20; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"gillness-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.fifthTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-17 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            
            /*
             [data setValue:@"2" forKey:@"itype"];*/
        }
    }
    
    [mcollectionViewController setContentArray:[marrays objectAtIndex:0]];
    [mcollectionViewController setSelectArray:selectArrayMedicalHistory];
    [mcollectionViewController.collectionView reloadData];
    
    // add toolbar above keyboard
    if (keyboardToolbar == nil)
    {
        keyboardToolbar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,                            self.view.bounds.size.width, 44)];
        
        keyboardToolbar.barStyle =UIBarStyleBlackTranslucent;
        UIBarButtonItem *previousButton = [[UIBarButtonItem alloc] initWithTitle:@"Previous"
                                                                           style:UIBarButtonItemStyleBordered
                                                                          target:self
                                                                          action:@selector(previousField:)];
        UIBarButtonItem *nextButton = [[UIBarButtonItem alloc] initWithTitle:@"Next"
                                                                       style:UIBarButtonItemStyleBordered
                                                                      target:self
                                                                      action:@selector(nextField:)];
        
        UIBarButtonItem *extraSpace = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:(UIBarButtonSystemItemFlexibleSpace) target:nil action:nil];
        
        
        [keyboardToolbar setItems:[[NSArray alloc] initWithObjects:previousButton, nextButton, extraSpace, nil]];
        for (UIView *subview in [[[self view] viewWithTag:9999] subviews]) {
            /* do something with subview */
            if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
                UITextField *temp2 = (UITextField *)subview;
                temp2.inputAccessoryView  = keyboardToolbar;
            }
            
            
        }
        
    }
    
}
-(void) previousField:(id)sender
{
    int index = [nextActive indexOfObject:[NSString stringWithFormat:@"%d", activeField.tag]];
    //NSLog(@"%d",index);
    if (0<index){
        [activeField resignFirstResponder];
        [[[[self view] viewWithTag:9999] viewWithTag:[[nextActive objectAtIndex:index-1] intValue]] becomeFirstResponder];
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
        if ((activeField.tag == 7)||(activeField.tag == 22))
            datepick.hidden = FALSE;
    }
}


-(void) nextField:(id)sender
{
    int index = [nextActive indexOfObject:[NSString stringWithFormat:@"%d", activeField.tag]];
    if ([nextActive count]-1>index){
        [activeField resignFirstResponder];
        [[[[self view] viewWithTag:9999] viewWithTag:[[nextActive objectAtIndex:index+1] intValue]] becomeFirstResponder];
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
        if ((activeField.tag == 7)||(activeField.tag == 22))
            datepick.hidden = FALSE;
    }
}

- (IBAction)segControlClicked:(id)sender
{
    int clickedSegment = ((UISegmentedControl*)sender).selectedSegmentIndex;
    int tag = ((UISegmentedControl*)sender).tag;
    //NSLog(@"%d", clickedSegment);
    if (clickedSegment == 0){
        ((UITextField*)[self.scrollview viewWithTag:-(tag)]).text = @"";
        ((UITextField*)[self.scrollview viewWithTag:-(tag)]).enabled = false;
    }else{
        ((UITextField*)[self.scrollview viewWithTag:-(tag)]).enabled = true;
    }
    //...
}
-(void)setStyle{
    for (UIView *subview in [self.view subviews]) {
        if (99999==subview.tag){
            //set ground corners for view
            [[subview layer] setCornerRadius:12.0];
            [[subview layer] setBorderWidth:1.0];
            [[subview layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
            
        }
        
    }
    
    
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

- (void) viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];
    //NSLog(@"Registering for keyboard events");
    
    // Register for the events
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector (keyboardDidShow:)
     name: UIKeyboardDidShowNotification
     object:nil];
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector (keyboardDidHide:)
     name: UIKeyboardDidHideNotification
     object:nil];
    
    // Setup content size
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        scrollview.contentSize = CGSizeMake(SCROLLVIEW_CONTENT_WIDTH,
                                            SCROLLVIEW_CONTENT_HEIGHT);
    }else{
        scrollview.contentSize = CGSizeMake(self.view.frame.size.height,
                                            SCROLLVIEW_CONTENT_HEIGHT);
    }
    
    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
//    [datepick removeFromSuperview];
}

-(void) viewWillDisappear:(BOOL)animated {
    //NSLog (@"Unregister for keyboard events");
    [[NSNotificationCenter defaultCenter]
     removeObserver:self];
}

-(void) keyboardDidShow: (NSNotification *)notif {
    //NSLog(@"Keyboard is visible");
    // If keyboard is visible, return
    if (keyboardVisible) {
        //NSLog(@"Keyboard is already visible. Ignore notification.");
        return;
    }
    
    // Keyboard is now visible
    keyboardVisible = YES;
}
-(void) keyboardDidHide: (NSNotification *)notif {
    // Is the keyboard already shown
    if (!keyboardVisible) {
        //NSLog(@"Keyboard is already hidden. Ignore notification.");
        return;
    }
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [scrollview setContentOffset:CGPointMake(0, 0) animated:YES];
    }
//    [scrollview setContentOffset:CGPointMake(0, 0) animated:YES];
    datepick.hidden = true;
    // Keyboard is no longer visible
    keyboardVisible = NO;
    
}
-(BOOL)textField:(UITextField *)textField shouldChangeCharactersInRange:(NSRange)range replacementString:(NSString *)string{
//    NSCharacterSet * set = [[NSCharacterSet characterSetWithCharactersInString:@"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLKMNOPQRSTUVWXYZ0123456789"] invertedSet];
//    
//    if ([string rangeOfCharacterFromSet:set].location == NSNotFound) {
//        NSLog(@"This string contains illegal characters");
//        return FALSE;
//    }
    if ([string isEqualToString:@"\""]) {
        return FALSE;
    }
    return YES;
}
-(BOOL) textFieldShouldBeginEditing:(UITextField*)textField {
    activeField = textField;
    
    [datepick removeFromSuperview];

    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
    }
    
    if ((textField.tag == 28)){
        NSLog(@"\nSizeDateForm: %@",NSStringFromCGRect(datepick.frame));
        datepick.hidden = FALSE;
    }
    //NSLog(@"%f",(activeField.frame.origin.y));
    return YES;
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}
- (IBAction)touchOut:(id)sender{
    //NSLog(@"touchesBegan:withEvent:");
    [activeField resignFirstResponder];
    //[self.view endEditing:YES];
    //[super touchesBegan:touches withEvent:event];
}
#pragma mark Table view methods

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView {
    return 1;
}

// Customize the number of rows in the table view.
- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section {
	return 4;
}
// Customize the appearance of table view cells.
- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath {
    
    if (tableView == self.firstTable) {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart1"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+0)]];
        return cell;
    } else if (tableView == self.secondTable) {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart2"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+4)]];
        return cell;
    } else if (tableView == self.thirdTable) {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart3"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+8)]];
        return cell;
    } else if (tableView == self.fourthTable) {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart4"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+12)]];
        return cell;
    } else if (tableView == self.fifthTable) {
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart5"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+16)]];
        return cell;
    }
    
    return nil;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 30;
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath {
	// open a alert with an OK and cancel button
	if (tableView == self.firstTable){
        if (0!=[[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+0)]] count])
            [self startRedFlags:[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+0)]] withIndexPath:indexPath];
        currentIndex = ([indexPath row]+0);
    }else if (tableView == self.secondTable){
        if (0!=[[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+4)]] count])
            [self startRedFlags:[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+4)]] withIndexPath:indexPath];
        currentIndex = ([indexPath row]+4);
    }else if (tableView == self.thirdTable){
        if (0!=[[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+8)]] count])
            [self startRedFlags:[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+8)]] withIndexPath:indexPath];
        currentIndex = ([indexPath row]+8);
    }else if (tableView == self.fourthTable){
        if (0!=[[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+12)]] count])
            [self startRedFlags:[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+12)]] withIndexPath:indexPath];
        currentIndex = ([indexPath row]+12);
    }else if (tableView == self.fifthTable){
        if (0!=[[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+16)]] count])
            [self startRedFlags:[red_flags valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+16)]] withIndexPath:indexPath];
        currentIndex = ([indexPath row]+16);
    }
	//[alert show];
}
-(void)startRedFlags:(NSDictionary*)idata withIndexPath:(NSIndexPath*)indexPath{
    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
    rteleRedFlagsViewController* redflagsvc = [storyboard instantiateViewControllerWithIdentifier:@"redflagstable"];
    [redflagsvc initWithData:idata];
    //test.view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 400, 160)];
    //[test.view setBackgroundColor:[UIColor whiteColor]];
    //[scrollview addSubview:imageView];
    UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, redflagsvc.tableView.frame.size.height - 44,self.view.frame.size.height ,44)];
    NSLog(@"\nSize: %f",self.view.frame.size.width - 44);
    toolbar.barStyle =UIBarStyleBlackTranslucent;
    UIBarButtonItem *cancel=[[UIBarButtonItem alloc] initWithTitle:@"Done" style:UIBarButtonItemStyleBordered target:self action:@selector(doSetRedFlags:)];
    //toolbar.userInteractionEnabled = true;
    redflagsvc.view.frame = CGRectMake(0, 44,redflagsvc.view.frame.size.width ,redflagsvc.view.frame.size.height);
    

//    redflagsvc.tableView.frame = CGRectMake(0, 84,redflagsvc.view.frame.size.width ,redflagsvc.view.frame.size.height);
    
    [redflagsvc.view setUserInteractionEnabled:true];
    
    [cancel setTag:1000];
    UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Set red flags"
                                                             style:UIBarButtonItemStylePlain
                                                            target:nil
                                                            action:nil];
    
    
    
    
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                                target:nil
                                                                                action:nil];
        
        NSArray *items = [[NSArray alloc] initWithObjects:cancel, spacer, item, spacer, nil];
        
        [toolbar setItems:items];
        [redflagsvc.view addSubview:toolbar];
        
        popoverController=[[UIPopoverController alloc] initWithContentViewController:redflagsvc];
        popoverController.delegate=self;
        popoverController.popoverContentSize=CGSizeMake(600, 400);
        [popoverController presentPopoverFromRect:CGRectMake(20, 222,97 ,21) inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionLeft animated:YES];
    }else{
        
        currentViewController = redflagsvc;
        UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithTitle:@"Cancel" style:UIBarButtonItemStyleBordered target:self action:@selector(cancelButtonClicked)];
        NSArray *items = [[NSArray alloc] initWithObjects:cancel, spacer, item, spacer, nil];
        
        [toolbar setItems:items];
        [redflagsvc.view addSubview:toolbar];
        
        [self presentViewController:redflagsvc animated:YES completion:nil];
    }
        
    
    
}

-(void) cancelButtonClicked{
    [currentViewController dismissViewControllerAnimated:YES completion:nil];
    currentViewController = nil;
}

-(IBAction)doSetRedFlags:(id)sender{
    // body part tables
    NSArray* selectedRows = [(UITableView*)popoverController.contentViewController.view  indexPathsForSelectedRows];
    NSMutableDictionary* itemp = [[NSMutableDictionary alloc] init];
    int k=0;
    for (NSIndexPath *iindexPath in selectedRows) {
        //[data setValue:@"on" forKey:[NSString stringWithFormat:@"gillness-%d",([iindexPath row]+1+0)]];
        [itemp setObject:[[red_flags valueForKey:[NSString stringWithFormat:@"%d", currentIndex]] valueForKey:[NSString stringWithFormat:@"%d", ([iindexPath row])]] forKey:[NSString stringWithFormat:@"%d", k]];
        k++;
        //NSLog(@"%d - %@",[selectedRows count],[[red_flags valueForKey:[NSString stringWithFormat:@"%d", currentIndex]] valueForKey:[NSString stringWithFormat:@"%d", ([iindexPath row])]]);
    }
    [redflags setObject:itemp forKey:[NSString stringWithFormat:@"%d", currentIndex]];
    //NSLog(@"%d - %@",[selectedRows count],redflags);
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [popoverController dismissPopoverAnimated:YES];
    }else{
        [currentViewController dismissViewControllerAnimated:YES completion:nil];
        currentViewController = nil;
    }
    
}

-(IBAction)changeSlide:(id)sender{
    islidertext.text = [NSString stringWithFormat:@"%d",(int)islider.value];
}
-(IBAction)changeSlideText:(id)sender{
    [islider setValue:[islidertext.text floatValue]];
    NSArray *accept = [NSArray arrayWithObjects: @"1", @"2", @"3", @"4", @"5", @"6", @"7" , @"8", @"9", nil];
    NSString *text;
    if ([islidertext.text length]>1){
        
        //NSLog(@"%@",[text substringFromIndex:[islidertext.text length]-1]);
        text = [islidertext.text substringFromIndex:[islidertext.text length]-1];
        if ([accept containsObject:text]) {
            islidertext.text = text;
        }else{
            islidertext.text = [islidertext.text substringToIndex:[islidertext.text length]-1];
        }
    }
    
    
}
-(IBAction)chooseDate:(id)sender{
    UIDatePicker *picker = (UIDatePicker *) sender;
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"dd/MM/yyyy"];
    activeField.text = [format stringFromDate:picker.date];
    
}
-(IBAction)startCamera:(id)sender{
    UIImagePickerController *imagePickerController = [[UIImagePickerController alloc] init];
    
    //imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
#if TARGET_IPHONE_SIMULATOR
    imagePickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
#else
    imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
#endif
    imagePickerController.delegate = self;
    [self presentViewController:imagePickerController animated:YES completion:nil];
    
    /*self.picker = [[UIImagePickerController alloc] init];
     self.picker.sourceType = UIImagePickerControllerSourceTypeCamera;
     self.picker.cameraCaptureMode = UIImagePickerControllerCameraCaptureModePhoto;
     self.picker.cameraDevice = UIImagePickerControllerCameraDeviceRear;
     self.picker.showsCameraControls = NO;
     self.picker.navigationBarHidden = YES;
     self.picker.toolbarHidden = YES;
     self.picker.wantsFullScreenLayout = YES;
     
     // Insert the overlay
     self.overlay = [[OverlayViewController alloc] initWithNibName:@"Overlay" bundle:nil];
     self.overlay.pickerReference = self.picker;
     self.picker.cameraOverlayView = self.overlay.view;
     self.picker.delegate = self.overlay;
     
     [self presentModalViewController:self.picker animated:NO];
     */
    //    [self.pickerReference takePicture];
}
- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker {
    [picker dismissViewControllerAnimated:YES completion:nil];

    //[popoverController dismissPopoverAnimated:YES];
}
- (void)imagePickerController:(UIImagePickerController *)picker didFinishPickingMediaWithInfo:(NSDictionary *)info {
    //UIImageView *imageView;
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    // You have the image. You can use this to present the image in the next view like you require in `#3`.
//    CGRect myImageRect = CGRectMake(currentX - 70, 10, 60, 45);
//    currentX = currentX - 70;
    CGRect myImageRect = CGRectZero;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        myImageRect = CGRectMake(currentX - 70, 10, 60, 45);
        currentX = currentX - 70;
    }else{
        myImageRect = CGRectMake(currentX , self.cameraButton.frame.origin.y, 60, 45);
        currentX = currentX + 70;
    }
    [images setValue:image forKey:[NSString stringWithFormat:@"%d",currentTag]];
    
    UIButton *button = [[UIButton alloc] initWithFrame: myImageRect];
    [button setBackgroundImage:image forState:UIControlStateNormal];
    [scrollview addSubview: button];
    [button setTag:currentTag];
    //NSLog(@"%d", currentTag);
    currentTag++;
    [button addTarget:nil action:@selector(viewImage:)  forControlEvents:UIControlEventTouchDown];
    //imageView = [[UIImageView alloc] initWithFrame:myImageRect];
    //[imageView setImage:image];
    //[scrollview addSubview:imageView];
   // [popoverController dismissPopoverAnimated:YES];
    [picker dismissViewControllerAnimated:YES completion:nil];

    
}
-(void)viewImage:(id)sender{
    rteleImagePreviewViewController* test = [[rteleImagePreviewViewController alloc] init];
    test.view = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 400, 300)];
    //UIImageView *imageView = [[UIImageView alloc] initWithFrame:CGRectMake(0, 0, 400, 300)];
    //NSLog(@"%d-%@",[images count],[images objectAtIndex:((UIButton*)sender).tag-4000]);
    [(UIImageView*)test.view  setImage:[images valueForKey:[NSString stringWithFormat:@"%d",((UIButton*)sender).tag]]];
    //[scrollview addSubview:imageView];
    UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,600 ,44)];
    toolbar.barStyle =UIBarStyleBlackTranslucent;
    NSMutableArray *ButtonArray=[[NSMutableArray alloc ]init];
    UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Delete" style:UIBarButtonItemStyleBordered target:self action:@selector(deleteImage:)];
    //toolbar.userInteractionEnabled = true;
    [test.view setUserInteractionEnabled:true];
    
    [cancel setTag:((UIButton*)sender).tag];
    
    [ButtonArray addObject:cancel];
    [toolbar setItems:ButtonArray];
    [test.view addSubview:toolbar];
    popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
    popoverController.delegate=self;
    popoverController.popoverContentSize=CGSizeMake(600, 450);
    [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionUp animated:YES];
}
-(IBAction)deleteImage:(id)sender{
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.5];
    
    [images setValue:@"" forKey:[NSString stringWithFormat:@"%d",((UIButton*)sender).tag]];
    [[scrollview viewWithTag:((UIButton*)sender).tag] removeFromSuperview];
    for (int i=((UIButton*)sender).tag+1; i<=currentTag; i++) {
        
        [scrollview viewWithTag:i].frame = CGRectMake([scrollview viewWithTag:i].frame.origin.x + 70, 10, 60, 45);
    }
    currentX = currentX + 70;
    [UIView commitAnimations];
    //NSLog(@"here2-%d",((UIButton*)sender).tag);
    
    [popoverController dismissPopoverAnimated:YES];
}

//  huy code
-(IBAction)toggleCheckboxes:(id)sender{
    UIButton *button = sender;
    [activeField resignFirstResponder];
    if ([[authens valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
        [button setSelected:YES];
        [authens setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
        
    }else{
        [button setSelected:NO];
        [authens setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
    }
}

- (void)tapSignature:(UIGestureRecognizer *)sender
{
    rteleSignatureViewController* vc = [self.storyboard instantiateViewControllerWithIdentifier:@"signPad"];
    vc.delegate = self;
    [self.navigationController presentViewController:vc animated:YES completion:nil];
}

// DELEGATE METHOD - handle the message from the AddNewItem view controller
- (void) signPadController:(rteleSignatureViewController *)signPadController didSign:(NSString *)signature{
    
    // Handle the incoming data/object
    signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:signature]];
    didsign = TRUE;
    //NSLog(@"responseStatusString %@",signature);
    // Dismiss the modal view controller
    [signPadController dismissViewControllerAnimated:YES completion:nil];
}
// end

#pragma mark - UIAlertViewDelegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    [[NSUserDefaults standardUserDefaults] setValue:nil forKey:@"postData"];
    [self goBackHome];
}
@end
