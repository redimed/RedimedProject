//
//  rteleFormS2Controller.m
//  telehealth
//
//  Created by Khoa Nguyen on 10/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleFormS2Controller.h"
#import "constants.h"
#import "rteleAppDelegate.h"
#import "SBJson.h"
#import "rteleImagePreviewViewController.h"
#import "rteleHorizontalCollectionViewController.h"

//huy code
#import "rteleSignatureViewController.h"
//end
#import "NSDataAdditions.h"

@interface rteleFormS2Controller ()<UITextFieldDelegate, UIAlertViewDelegate, UIGestureRecognizerDelegate>{
    BOOL isBad;
    
    UIViewController *currentViewController;
}

@end

@implementation rteleFormS2Controller
@synthesize scrollview;
@synthesize datepick;
@synthesize icollectionViewController;
@synthesize mcollectionViewController;
@synthesize injury;
@synthesize arrays;
@synthesize scollectionViewController;
@synthesize injurysymptoms;
@synthesize sarrays;
@synthesize medicalhist;
@synthesize marrays;
@synthesize islider;
@synthesize islidertext;
@synthesize adate;
@synthesize alocation;
@synthesize reason;
@synthesize mhistorytxt;
@synthesize injuretxt;
@synthesize injuredesctxt;
@synthesize bdyparttxt;
@synthesize medication;
@synthesize allergies;
@synthesize data;
@synthesize popoverController;
@synthesize images;
@synthesize currentIndex;
@synthesize currentX;
@synthesize imagesdata;
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
NSMutableArray *selectArrayMedicalHistory;
NSMutableArray *selectArrayInjDesc;
NSMutableArray *selectArrayInjSymp;
//  huy code
BOOL didsign;
//end
#define nextActive [NSArray arrayWithObjects: @"28",@"29",@"31",@"33",@"35",@"49",@"40",@"41",@"51", nil]

- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    if ([segue.identifier isEqualToString:@"iCollectionViewSegue"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        icollectionViewController = destinationVC;
    }
    else if ([segue.identifier isEqualToString:@"mCollectionViewSegue"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        mcollectionViewController = destinationVC;
    }
    else if ([segue.identifier isEqualToString:@"sCollectionViewSegue"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        scollectionViewController = destinationVC;
    }
}

NSDictionary* bodyparts;
- (IBAction)submit:(id)sender{
//    UIView *backgroundView = [[UIView alloc] initWithFrame:self.view.bounds];
//    [backgroundView setBackgroundColor:[UIColor colorWithRed:192/255.0 green:192/255.0 blue:192/255.0 alpha:0.8]];
//    [backgroundView setTag:9999];
//    [self.view addSubview:backgroundView];
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    data = [NSMutableDictionary dictionaryWithDictionary:[defaults valueForKey:@"postData"]];
    for (UIView *subview in [[self.scrollview viewWithTag:9999] subviews]) {
        /* do something with subview */
        //UITextField *field = (UITextField *)[self viewWithTag: tagValue];
        
        if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
            UITextField *temp = (UITextField *)subview;
            [data setValue:temp.text forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        if ((30==subview.tag)){
            UISegmentedControl *temp = (UISegmentedControl *)subview;
            if (1==temp.selectedSegmentIndex)
                [data setValue:@"yes" forKey:[fields objectAtIndex:(subview.tag-1)]];
            else
                [data setValue:@"no" forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        
    }
    //describe the injury table
    NSArray* selectedRows = [icollectionViewController.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"injdesc-%ld",([iindexPath row]+1)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"injdesc-%d", [iindexPath row]+1]);
    }
    //medical history table
    selectedRows = [mcollectionViewController.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"mhistory-%ld",([iindexPath row]+1)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"mhistory-%d", [iindexPath row]+1]);
    }
    //injury symptoms table
    selectedRows = [scollectionViewController.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"symptoms-%ld",([iindexPath row]+1)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1]);
    }
    // body part tables
    selectedRows = [self.firstTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"bdypart-%ld",([iindexPath row]+1+0)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1+0]);
    }
    selectedRows = [self.secondTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"bdypart-%ld",([iindexPath row]+1+3)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1+3]);
    }
    selectedRows = [self.thirdTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"bdypart-%ld",([iindexPath row]+1+6)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1+6]);
    }
    selectedRows = [self.fourthTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"bdypart-%ld",([iindexPath row]+1+9)]];
       // NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1+9]);
    }
    selectedRows = [self.fifthTable indexPathsForSelectedRows];
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"bdypart-%ld",([iindexPath row]+1+12)]];
        //NSLog(@"%d - %@",[selectedRows count],[NSString stringWithFormat:@"symptoms-%d", [iindexPath row]+1+12]);
    }
    [data setValue:@"2" forKey:@"itype"];
    
//    Huy edit insert Signature worker to databse for general illness
    NSString *signtext = [defaults objectForKey:@"signtxt"];
    
    if (signtext) {
        [data setValue:signtext forKey:@"signtxt"];
    }
//    End Huy edit
    
    [defaults setValue:data forKey:@"postData"];
    for (UIView *subview in [[self.scrollview viewWithTag:9999] subviews]) {
        /* do something with subview */
        //UITextField *field = (UITextField *)[self viewWithTag: tagValue];
        
        if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
            UITextField *temp = (UITextField *)subview;
            [data setValue:temp.text forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        if ((30==subview.tag)){
            UISegmentedControl *temp = (UISegmentedControl *)subview;
            if (1==temp.selectedSegmentIndex)
                [data setValue:@"yes" forKey:[fields objectAtIndex:(subview.tag-1)]];
            else
                [data setValue:@"no" forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        
    }
    
    if (
        ((1==((UISegmentedControl *)[[self.scrollview viewWithTag:9999] viewWithTag:(-37)]).selectedSegmentIndex)
         &&([((UITextField *)[[self.scrollview viewWithTag:9999] viewWithTag:(37)]).text isEqualToString:@""]))
        ){
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
    
//  huy code
    isBad = FALSE;
    for (NSString *key in [authens allKeys]){
        [data setValue:[authens objectForKey:key] forKey:[NSString stringWithFormat:@"authen-%d",([key intValue]-250)]];
        if ([[authens objectForKey:key] isEqualToString:@"off"]) {
            isBad = TRUE;
        }
    }
    
    if (!isBad) {
        if(didsign) {
            rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
            [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
            [activeField resignFirstResponder];
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
            if (compressionRatio<=0.1 )
                break;
           // NSLog(@"%d", [imagedata length]);
        }
        NSString *base64string = [imagedata base64Encoding];
        [imagesdata setValue:base64string forKey:key];
    }
    //NSLog(@"%@",json);
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    NSString *post;
    
    if (edit){
        post = [NSString stringWithFormat:@"data=%@&type=edit&companyId=%@&images=%@&allauthen=%@&redflags=&id=%@",
                      (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),
                      [defaults objectForKey:@"companyId"],
                      [jsonWriter stringWithObject:imagesdata],[defaults objectForKey:@"allauthen"], entry.eid];
    }else{
        post = [NSString stringWithFormat:@"data=%@&type=add&companyId=%@&images=%@&allauthen=%@&redflags=",
                          (__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),
                          [defaults objectForKey:@"companyId"],
                          [jsonWriter stringWithObject:imagesdata],[defaults objectForKey:@"allauthen"]];
    }
    //NSLog(@"%@", post);
    
//    NSString *retval =[rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/formSubmit" postData:post showAlert:YES];

    NSString *retval =[rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/formSubmit/?token=%@",[defaults objectForKey:@"tokenUser"]] postData:post showAlert:NO];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
//    UIView *view = [self.view viewWithTag:9999];
//    [view removeFromSuperview];
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
//        [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your information and your network have some problem.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
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
    currentIndex = 4000;
    adate.inputView = datepick;
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    //bodyparts = [[NSDictionary alloc] initWithObjectsAndKeys:@"Left lower leg", @"0",@"Right lower leg", @"1",@"Left upper leg","2",@"Right upper leg", @"3",@"Left lower arm", @"4",@"Left lower arm", @"5",@"Left upper arm", @"6",@"Right upper arm", @"7",@"Hendecagon", @"8",@"Dodecagon", @"9",nil];
    images = [[NSMutableDictionary alloc] init];
    imagesdata = [[NSMutableDictionary alloc] init];
    bodyparts = [[NSDictionary alloc] initWithObjectsAndKeys:
                 @"Left lower leg", @"0",
                 @"Right lower leg", @"1",
                 @"Left upper leg",@"2",
                 @"Right upper leg", @"3",
                 @"Left lower arm", @"4",
                 @"Right lower arm", @"5",
                 @"Left upper arm", @"6",
                 @"Right upper arm", @"7",
                 @"Left hand", @"8",
                 @"Right hand", @"9",
                 @"Left shoulder", @"10",
                 @"Right shoulder", @"11",
                 @"Abdomen", @"12",
                 @"Chest", @"13",
                 @"Lower back", @"14",
                 nil];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    data = [NSMutableDictionary dictionaryWithDictionary:[defaults valueForKey:@"postData"]];
    for (int i=1;i<=15; i++)
        [data setValue:@"off" forKey:[NSString stringWithFormat:@"bdypart-%d",i]];
    [defaults setValue:data forKey:@"postData"];
    injury = [[NSArray alloc] initWithObjects:@"Sprain/Strain", @"Laceration", @"Crush", @"Fall", nil];
    float sum = 0;
    for (NSString *str in injury){
        CGFloat height = 20+[str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height*1;
    }
    UIView *injuryView = [icollectionViewController.collectionView.superview.superview superview];
    injuryView.frame = CGRectMake(injuryView.frame.origin.x, injuryView.frame.origin.y, sum, 30);
    arrays = [[NSArray alloc] initWithObjects:injury, nil];
    medicalhist = [[NSArray alloc] initWithObjects:@"Asthma", @"Epilepsy", @"Heart condition", @"High cholesterol", @"Diabetes type I", @"Diabetes type II", @"High blood pressure", @"Arthritis", @"Blood condition", nil];
    sum = 0;
    for (NSString *str in medicalhist){
        CGFloat height = 20+ [str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height*1;
    }
    UIView *medicalView = [mcollectionViewController.collectionView.superview.superview superview];
    medicalView.frame = CGRectMake(medicalView.frame.origin.x, medicalView.frame.origin.y, sum, 30);
    marrays = [[NSArray alloc] initWithObjects:medicalhist, nil];
    injurysymptoms = [[NSArray alloc] initWithObjects:@"Open wound", @"Swelling", @"Redness", @"Reduced movement", nil];
    sum = 0;
    for (NSString *str in injurysymptoms){
        CGFloat height = 20+ [str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height*1;
    }
    UIView *symptomsView = [scollectionViewController.collectionView.superview.superview superview];
    symptomsView.frame = CGRectMake(symptomsView.frame.origin.x, symptomsView.frame.origin.y, sum, 30);
    sarrays = [[NSArray alloc] initWithObjects:injurysymptoms, nil];
    
    selectArrayMedicalHistory = [[NSMutableArray alloc] initWithObjects:@"no", @"no", @"no",@"no",@"no",@"no",@"no",@"no",@"no", nil];
    selectArrayInjDesc = [[NSMutableArray alloc] initWithObjects:@"no", @"no", @"no",@"no", nil];
    selectArrayInjSymp = [[NSMutableArray alloc] initWithObjects:@"no", @"no", @"no",@"no", nil];
    edit = false;
    
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"dd/MM/yyyy"];
    
    //get the date today
    NSString *dateToday = [format stringFromDate:[NSDate date]];
    ((UITextField *)[[self.scrollview viewWithTag:9999] viewWithTag:28]).text = dateToday;
    
    [adate setText:dateToday];
    if (nil!=entry){
        edit = true;
        if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"2"]){
            //NSLog(@"%@", entry.detail);
            
            for (UIView *subview in [[self.scrollview viewWithTag:9999] subviews]) {
                /* do something with subview */
                //UITextField *field = (UITextField *)[self viewWithTag: tagValue];
                
                if ((0<subview.tag)&&(1!=subview.tag)&&(30!=subview.tag)&&(1000>subview.tag)){
                    UITextField *temp = (UITextField *)subview;
                    temp.text = [entry.detail objectForKey:[fields objectAtIndex:(subview.tag-1)]];
                    if (subview.tag == 40){
                        [self changeSlideText:subview];
                    }
                }
                if ((30==subview.tag)){
                    UISegmentedControl *temp = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"hasbe4"] isEqualToString:@"on"]){
                        temp.selectedSegmentIndex = 2;
                    }else{
                        temp.selectedSegmentIndex = 1;
                    }
                }
                if ((-37==subview.tag)){
                    UISegmentedControl *temp = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"medication"] isEqualToString:@""]){
                        temp.selectedSegmentIndex = 2;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:37]).enabled = false;
                    }else{
                        temp.selectedSegmentIndex = 1;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:37]).enabled = true;
                    }
                }
                if ((-38==subview.tag)){
                    UISegmentedControl *temp = (UISegmentedControl *)subview;
                    if ([[entry.detail objectForKey:@"allergies"] isEqualToString:@""]){
                        temp.selectedSegmentIndex = 2;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:38]).enabled = false;
                    }else{
                        temp.selectedSegmentIndex = 1;
                        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:38]).enabled = true;
                    }
                }
                
            }
            //describe the injury table
            for (int i=1;i<=[injury count]; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"injdesc-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [selectArrayInjDesc replaceObjectAtIndex:i-1 withObject:@"yes"];
                }
            }
            //medical history table
            for (int i=1;i<=[medicalhist count]; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"mhistory-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [selectArrayMedicalHistory replaceObjectAtIndex:i-1 withObject:@"yes"];
                }
            }
            //injury symptoms table
            for (int i=1;i<=[injurysymptoms count]; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"symptoms-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [selectArrayInjSymp replaceObjectAtIndex:i-1 withObject:@"yes"];
                }
            }
            
             // body part tables
            for (int i=1;i<=3; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"bdypart-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.firstTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-1 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=4;i<=6; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"bdypart-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.secondTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-4 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=7;i<=9; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"bdypart-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.thirdTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-7 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=10;i<=12; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"bdypart-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.fourthTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-10 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            for (int i=13;i<=15; i++) {
                if ([[entry.detail objectForKey:[NSString stringWithFormat:@"bdypart-%d",i]] isEqualToString:@"on"]){
                    //NSLog(@"here");
                    [self.fifthTable selectRowAtIndexPath:[NSIndexPath indexPathForRow:i-13 inSection:0] animated:NO scrollPosition:UITableViewScrollPositionNone];
                }
            }
            
            /*
             [data setValue:@"2" forKey:@"itype"];*/
        }
    }
    
    [mcollectionViewController setContentArray:[marrays objectAtIndex:0]];
    [mcollectionViewController setSelectArray:selectArrayMedicalHistory];
    [mcollectionViewController.collectionView reloadData];
    [scollectionViewController setContentArray:[sarrays objectAtIndex:0]];
    [scollectionViewController setSelectArray:selectArrayInjSymp];
    [scollectionViewController.collectionView reloadData];
    [icollectionViewController setContentArray:[arrays objectAtIndex:0]];
    [icollectionViewController setSelectArray:selectArrayInjDesc];
    [icollectionViewController.collectionView reloadData];
    
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
                UITextField *temp = (UITextField *)subview;
                temp.inputAccessoryView  = keyboardToolbar;
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
        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:-(tag)]).text = @"";
        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:-(tag)]).enabled = false;
    }else{
        ((UITextField*)[[self.scrollview viewWithTag:9999] viewWithTag:-(tag)]).enabled = true;
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
- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
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
    
    if ((textField.tag == 28))
        datepick.hidden = FALSE;
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
    if (tableView == self.firstTable){
        //NSLog(@"table 1");
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart1"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+0)]];
        return cell;
    } else if (tableView == self.secondTable){
        //NSLog(@"table 2");
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart2"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+3)]];
        return cell;
    } else if (tableView == self.thirdTable){
        //NSLog(@"table 2");
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart3"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+6)]];
        return cell;
    } else if (tableView == self.fourthTable){
        //NSLog(@"table 2");
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart4"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+9)]];
        return cell;
    } else if (tableView == self.fifthTable){
        //NSLog(@"table 2");
        UITableViewCell *cell = [tableView dequeueReusableCellWithIdentifier:@"bodypart5"];
        cell.textLabel.font = [UIFont fontWithName:@"Helvetica" size:15];
        cell.textLabel.text = [bodyparts valueForKey:[NSString stringWithFormat:@"%d", ([indexPath row]+12)]];
        return cell;
    }
    
    return nil;
}

-(CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath{
    return 30;
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
#if TARGET_IPHONE_SIMULATOR
    imagePickerController.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
#else
    imagePickerController.sourceType = UIImagePickerControllerSourceTypeCamera;
#endif
    imagePickerController.delegate = self;
    [self presentViewController:imagePickerController animated:YES completion:nil];
//    popoverController=[[UIPopoverController alloc] initWithContentViewController:imagePickerController];
//    popoverController.delegate=self;
//    [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionAny animated:YES];
//    
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
    //NSLog(@"herhe");
    //UIImageView *imageView;
    UIImage *image = [info objectForKey:UIImagePickerControllerOriginalImage];
    // You have the image. You can use this to present the image in the next view like you require in `#3`.
    CGRect myImageRect = CGRectZero;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        myImageRect = CGRectMake(currentX - 70, 10, 60, 45);
        currentX = currentX - 70;
    }else{
        myImageRect = CGRectMake(currentX , self.cameraButton.frame.origin.y, 60, 45);
        currentX = currentX + 70;
    }
    [images setValue:image forKey:[NSString stringWithFormat:@"%d",currentIndex]];
    
    UIButton *button = [[UIButton alloc] initWithFrame: myImageRect];
    [button setBackgroundImage:image forState:UIControlStateNormal];
    [scrollview addSubview: button];
    [button setTag:currentIndex];
    currentIndex++;
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
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [toolbar setItems:ButtonArray];
        [test.view addSubview:toolbar];
        popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
        popoverController.delegate=self;
        popoverController.popoverContentSize=CGSizeMake(600, 450);
        [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:scrollview permittedArrowDirections:UIPopoverArrowDirectionUp animated:YES];
    }else{
        currentViewController = test;
    
        
        UIBarButtonItem *doneBarButton = [[UIBarButtonItem alloc] initWithTitle:@"Done" style:UIBarButtonItemStyleBordered target:self action:@selector(doneButtonClicked:)];
//        [test.navigationItem setRightBarButtonItem:doneBarButton];
        [ButtonArray addObject:doneBarButton];
        [toolbar setItems:ButtonArray];
        
        [test.view addSubview:toolbar];
        [self presentViewController:test animated:YES completion:nil];
    }
   
}
-(void) doneButtonClicked:(UIButton *) button{
    [currentViewController dismissViewControllerAnimated:YES completion:nil];
    currentViewController = nil;
}
-(IBAction)deleteImage:(id)sender{
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDuration:0.5];
        
        [images setValue:@"" forKey:[NSString stringWithFormat:@"%ld",(long)((UIButton*)sender).tag]];
        [[scrollview viewWithTag:((UIButton*)sender).tag] removeFromSuperview];
        for (int i=((UIButton*)sender).tag+1; i<=currentIndex; i++) {
            
            [scrollview viewWithTag:i].frame = CGRectMake([scrollview viewWithTag:i].frame.origin.x + 70, 10, 60, 45);
        }
        currentX = currentX + 70;
        [UIView commitAnimations];
        NSLog(@"here2-%ld",(long)((UIButton*)sender).tag);
        
        [popoverController dismissPopoverAnimated:YES];
    }else{
        //delete image in iphone
        
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDuration:0.5];
        
        [images setValue:@"" forKey:[NSString stringWithFormat:@"%ld",(long)((UIButton*)sender).tag]];
        [[scrollview viewWithTag:((UIButton*)sender).tag] removeFromSuperview];
        for (int i=((UIButton*)sender).tag+1; i<=currentIndex; i++) {
            
            [scrollview viewWithTag:i].frame = CGRectMake([scrollview viewWithTag:i].frame.origin.x - 70, self.cameraButton.frame.origin.y, 60, 45);
        }
        currentX = currentX - 70;
        [UIView commitAnimations];
        
        
        [currentViewController dismissViewControllerAnimated:YES completion:nil];
        currentViewController = nil;
    }
    
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
