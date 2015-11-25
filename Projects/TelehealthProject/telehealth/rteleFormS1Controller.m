//
//  rteleFormS1Controller.m
//  telehealth
//
//  Created by Khoa Nguyen on 7/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleFormS1Controller.h"
#import "rteleAppDelegate.h"
#import "rteleSignatureViewController.h"
#import "constants.h"
#import "rteleFormS2bController.h"
#import "rteleFormS2Controller.h"
#import "NSDataAdditions.h"
#import "rteleHorizontalCollectionViewController.h"
#import "SBJson.h"
#import "MBProgressHUD.h"


typedef NS_ENUM(NSUInteger, PasswordValidatorSegmentIndexes) {
    LenientValidatorSegmentIndex,
};
@interface rteleFormS1Controller () <UIGestureRecognizerDelegate>{
    BOOL isBad;
    
    //
    BOOL isLoadData;;
    NSMutableDictionary *dataView;
    NSString *entryId;
}
@end

@implementation rteleFormS1Controller
@synthesize employeeId;
@synthesize signtxt;
@synthesize scrollview;
@synthesize datepick;
@synthesize authens;
@synthesize servicerequired;
@synthesize servicerequired2;
@synthesize sarrays;
@synthesize sarrays2;
@synthesize scollectionViewController;
@synthesize scollectionViewController2;
@synthesize data;
@synthesize relation;
@synthesize cholder;
@synthesize PHI;
@synthesize HC;
@synthesize keyboardToolbar;

@synthesize fname;
@synthesize gname;
@synthesize dob;
@synthesize address;
@synthesize suburb;
@synthesize postcode;
@synthesize telhome;
@synthesize telwork;
@synthesize telmob;
@synthesize nok;
@synthesize telnok;
@synthesize medicare;
@synthesize medref;
@synthesize medexpiry;
@synthesize healthFund;
@synthesize memno;
@synthesize vano;
@synthesize entry;
@synthesize edit;

@synthesize salutation = salutation;

BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
int buttontag;
NSMutableArray *selectArray;
NSMutableArray *selectArray2;
BOOL allgood;
BOOL didsign;
#define nextActive [NSArray arrayWithObjects: @"7",@"5",@"6",@"4",@"8",@"9",@"10",@"11",@"12",@"13",@"14",@"15",@"20",@"21",@"22",@"18",@"19",@"23",@"50", nil]

- (void) prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender{
    
    if ([segue.identifier isEqualToString:@"illnesssegue"]) {
        rteleFormS2bController *destViewController = segue.destinationViewController;
        destViewController.employeeId = employeeId;
        destViewController.entry = entry;
    }
    else if ([segue.identifier isEqualToString:@"injurysegue"]) {
        rteleFormS2Controller *destViewController = segue.destinationViewController;
        destViewController.employeeId = employeeId;
        destViewController.entry = entry;
    }
    else if ([segue.identifier isEqualToString:@"sCollectionViewSegue"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        scollectionViewController = destinationVC;
    }
    else if ([segue.identifier isEqualToString:@"sCollectionViewSegue2"]) {
        rteleHorizontalCollectionViewController *destinationVC = [segue destinationViewController];
        scollectionViewController2 = destinationVC;
    }
}

-(void) updateEntryWithId{
    //json/updateDetailEntry (id, detail)
    UITextField *claimNo = (UITextField *)[self.scrollview viewWithTag:555];
    if (claimNo.text.length > 0) {
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            //Get doctor ID
            [dataView setValue:claimNo.text forKey:@"claimno"];
            SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
            NSString *retVal = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/updateDetailEntry" postData:[NSString stringWithFormat:@"detail=%@&id=%@",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:dataView],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entryId]];
            if ([retVal isEqualToString:@"0"]) {
                [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Update Failed!.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
            }else{
                if ([retVal integerValue] > 0) {
                    [[[UIAlertView alloc] initWithTitle:@"Success!" message:@"Updated successful." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
                }else{
                    [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your information and your network have some problem.\nPlease check and submit it again." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
                }
            }
//            if ([retVal isEqualToString:@"1"]) {
//                [[[UIAlertView alloc] initWithTitle:@"Success" message:@"Updated successful" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//            }else{
//                [[[UIAlertView alloc] initWithTitle:@"Error!" message:@"Updated Failed!" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//            }
            // Do something...
            [MBProgressHUD hideHUDForView:self.view animated:YES];
        });
        
        //End

    }
    
    
}

-(void)dataForView:(NSMutableDictionary *)dataForView entryID:(NSString *)entrywithId{
    dataView = dataForView;
    isLoadData = YES;
    entryId = entrywithId;
}
-(void) loadDataForView:(NSDictionary *)dataForView{
    
    if (![dataForView isEqual:[NSNull null]]) {
        for (UIView *subview in [self.scrollview subviews]) {
            if (subview.tag == 1001 || subview.tag == 1002 || subview.tag == 1003) {
                [subview setHidden:YES];
                if (subview.tag == 1003) {
                    [subview setHidden:NO];
                    UIButton *button = (UIButton *) subview;
                    [button addTarget:self action:@selector(updateEntryWithId) forControlEvents:UIControlEventTouchUpInside];
                }
            }
            if (subview.tag == 555) { //Claim bo
                UITextField *temp = (UITextField *)subview;
                [temp setText:[dataForView objectForKey:[fields objectAtIndex:(fields.count - 2)]]];
                continue;
            }
            if (subview.tag == 556) { //Email
                UITextField *temp = (UITextField *)subview;
                [temp setText:[dataForView objectForKey:[fields objectAtIndex:(fields.count - 1)]]];
                [temp setEnabled:NO];
                continue;
            }
            
            if ((0!=subview.tag)&&(1!=subview.tag)&&(3!=subview.tag)&&(16!=subview.tag)&&(17!=subview.tag)&&(24!=subview.tag)&&(251!=subview.tag)&&(252!=subview.tag)&&(253!=subview.tag)&&(254!=subview.tag)&&(1000>subview.tag)){
                UITextField *temp = (UITextField *)subview;
                NSString *stringData = [dataForView objectForKey:[fields objectAtIndex:(subview.tag-1)]];
                NSLog(@"%@",stringData);
                [temp setText:[dataForView objectForKey:[fields objectAtIndex:(subview.tag-1)]]];
                [temp setEnabled:NO];
            }
            
            if ((1==subview.tag)||(3==subview.tag)||(24==subview.tag)){
                UISegmentedControl *temp = (UISegmentedControl *)subview;
                NSString *stringData = [dataForView objectForKey:[fields objectAtIndex:(subview.tag-1)]];
                if (![stringData isEqual:[NSNull null]]) {
                    NSInteger index = [[dataForView objectForKey:[fields objectAtIndex:(subview.tag-1)]] integerValue] - 1;
                    temp.selectedSegmentIndex = index;
                }
                
                [temp setEnabled:NO];
            }
            if ((16==subview.tag)||(17==subview.tag)){
                UISegmentedControl *temp = (UISegmentedControl *)subview;
                NSInteger index = [[dataForView objectForKey:[fields objectAtIndex:(subview.tag-1)]] integerValue];
                if (1==index){
                    temp.selectedSegmentIndex = 1;
                }
                else
                    temp.selectedSegmentIndex = 0;
                [temp setEnabled:NO];
            }
            
            //checkbox
            if (subview.tag == 251 || subview.tag == 252 || subview.tag == 253 || subview.tag == 254) {
                UIButton *button = (UIButton *) subview;
                if ([[dataView objectForKey:[NSString stringWithFormat:@"authen-%ld",button.tag - 250]] isEqualToString:@"on"]) {
                    [button setSelected:YES];
                }
                
            }
            
            //sign
            if ([subview isEqual:signtxt]){
                NSString *signtext = [dataView objectForKey:@"signtxt"];
                if (signtext != nil) {
                    NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:@" " options:NSRegularExpressionCaseInsensitive error:nil];
                    UIImage *image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:[regex stringByReplacingMatchesInString:signtext options:0 range:NSMakeRange(0, [signtext length]) withTemplate:@"+"]]];
                    [signtxt setImage:image];
                }
            }
        }
        
        //
        for (int i = 1; i <= 4; i++) {
            if ([[dataView valueForKey:[NSString stringWithFormat:@"require-%d",i]] isEqualToString:@"on"]) {
                [selectArray replaceObjectAtIndex:(i-1) withObject:@"yes"];
            }
        }
        for (int  i = 5; i <= 7; i++) {
            if ([[dataView valueForKey:[NSString stringWithFormat:@"require-%d",i]] isEqualToString:@"on"]) {
                [selectArray2 replaceObjectAtIndex:(i-5) withObject:@"yes"];
            }
        }
    }
    
    
    //Load again
    
    [scollectionViewController setSelectArray:selectArray];
    [scollectionViewController.collectionView reloadData];
    [scollectionViewController2 setSelectArray:selectArray2];
    [scollectionViewController2.collectionView reloadData];
    [scollectionViewController2.collectionView setShouldGroupAccessibilityChildren:NO];
    
    //add mask
    UIView *mask = [[UIView alloc] initWithFrame:CGRectMake(scollectionViewController.view.frame.origin.x, scollectionViewController.view.frame.origin.y, scollectionViewController2.view.frame.size.width + 100, 300)];
    [self.view addSubview:mask];
}
-(void)saveData{
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    data = [NSMutableDictionary dictionaryWithDictionary:[defaults valueForKey:@"postData"]];
    bool gotfone = FALSE;
    for (UIView *subview in [self.scrollview subviews]) {
        /* do something with subview */
        //UITextField *field = (UITextField *)[self viewWithTag: tagValue];
        
        if (subview.tag == 555) { //Claim bo
            UITextField *temp = (UITextField *)subview;
            [data setValue:temp.text forKey:[fields objectAtIndex:(fields.count - 2)]];
            continue;
        }
        if (subview.tag == 556) { //Email
            UITextField *temp = (UITextField *)subview;
            [data setValue:temp.text forKey:[fields objectAtIndex:(fields.count - 1)]];
            continue;
        }
        
        if ((0!=subview.tag)&&(1!=subview.tag)&&(3!=subview.tag)&&(16!=subview.tag)&&(17!=subview.tag)&&(24!=subview.tag)&&(251!=subview.tag)&&(252!=subview.tag)&&(253!=subview.tag)&&(254!=subview.tag)&&(1000>subview.tag)){
            UITextField *temp = (UITextField *)subview;
            [data setValue:temp.text forKey:[fields objectAtIndex:(subview.tag-1)]];
            //NSLog(@"%d",subview.tag);
            if (([[required objectAtIndex:(subview.tag-1)] isEqualToString:@"yes"]) &&([temp.text isEqualToString:@""])){
                allgood = FALSE;
                //NSLog(@"%d",subview.tag);
            }
            if (((11==subview.tag)||(12==subview.tag)||(13==subview.tag))&& !([temp.text isEqualToString:@""])){
                gotfone = true;
            }
            
        }
        
        if ((1==subview.tag)||(3==subview.tag)||(24==subview.tag)){
            UISegmentedControl *temp = (UISegmentedControl *)subview;
            [data setValue:[NSString stringWithFormat:@"%d",(temp.selectedSegmentIndex+1)] forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        if ((16==subview.tag)||(17==subview.tag)){
            UISegmentedControl *temp = (UISegmentedControl *)subview;
            if (1==temp.selectedSegmentIndex)
                [data setValue:@"yes" forKey:[fields objectAtIndex:(subview.tag-1)]];
            else
                [data setValue:@"no" forKey:[fields objectAtIndex:(subview.tag-1)]];
        }
        
        
    }
    if (!gotfone)
        allgood = FALSE;
    
    isBad = FALSE;
    for (NSString *key in [authens allKeys]){
        [data setValue:[authens objectForKey:key] forKey:[NSString stringWithFormat:@"authen-%d",([key intValue]-250)]];
        if ([[authens objectForKey:key] isEqualToString:@"off"] || [[authens objectForKey:key] isEqualToString:@"on"]) {
            isBad = FALSE;
//		if ([[authens objectForKey:key] isEqualToString:@"off"]) {
//            isBad = TRUE;
        }
    }
    
    NSArray* selectedRows = [scollectionViewController.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"require-%d",([iindexPath row]+1)]];
    }
    
    selectedRows = [scollectionViewController2.collectionView indexPathsForSelectedItems];
    
    for (NSIndexPath *iindexPath in selectedRows) {
        [data setValue:@"on" forKey:[NSString stringWithFormat:@"require-%d",([iindexPath row]+1+4)]];
    }
    
    
    [defaults setValue:data forKey:@"postData"];
}

- (void)submit:(id)sender{
    UIButton *button = (UIButton*)sender;
    
    UIAlertView *alert;
    allgood = TRUE;
    [self saveData];
    buttontag = button.tag;
    //  Huy Comment Not Check Signature
//    NSString *signtext = [[NSUserDefaults standardUserDefaults] valueForKey:@"signtxt"];
//    if (signtext.length <= 0) {
//        [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"You must have your signature again. Please" delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
//    }
//    else{
//	if (([[authens valueForKey:@"251"] isEqualToString:@"off"])||([[authens valueForKey:@"253"] isEqualToString:@"off"])){
//            alert = [[UIAlertView alloc] initWithTitle:@"Consent box(es) left un-checked. Are you sure you want to continue?" message:@"" delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"Yes",nil];
//            [alert show];
//        }else{
            
//            if (allgood && didsign){
        //if (([[authens valueForKey:@"251"] isEqualToString:@"off"])||([[authens valueForKey:@"253"] isEqualToString:@"off"])){
          //  alert = [[UIAlertView alloc] initWithTitle:@"Consent box(es) left un-checked. Are you sure you want to continue?" message:@"" delegate:self cancelButtonTitle:@"Cancel" otherButtonTitles:@"Yes",nil];
//            [alert show];
//      }else{
            if (allgood){ //&& didsign
                if (!isBad) {
                    if (1001 == buttontag){
                        [self performSegueWithIdentifier:@"injurysegue" sender:nil];
                    }else{
                        [self performSegueWithIdentifier:@"illnesssegue" sender:nil];
                    }
                    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
                    [defaults setValue:@"yes" forKey:@"allauthen"];
                }else{
                    [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"You must check all checkbox." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
                }
                
            }else{
                UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Fields with * are required." message:@"" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
                [alert show];
            }
            
    //    }
//    }
    
    
    /*
        if (1001 == button.tag){
            [self performSegueWithIdentifier:@"illnesssegue" sender:sender];
        }else{
            [self performSegueWithIdentifier:@"injurysegue" sender:sender];
        }*/
    //}
    
}
- (void)alertView:(UIAlertView *)actionSheet clickedButtonAtIndex:(NSInteger)buttonIndex {
    
    if (isLoadData) {
        [self.navigationController popViewControllerAnimated:YES];
    }else{
        //Checks For Approval
        if (buttonIndex == 1) {
            if (allgood && didsign){
                if (!isBad) {
                    if (1001 == buttontag){
                        [self performSegueWithIdentifier:@"injurysegue" sender:nil];
                    }else{
                        [self performSegueWithIdentifier:@"illnesssegue" sender:nil];
                    }
                    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
                    [defaults setValue:@"yes" forKey:@"allauthen"];
                }else{
                    [[[UIAlertView alloc] initWithTitle:@"Warning!" message:@"You must check all checkbox required!." delegate:nil cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
                }
                
            }else{
                UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Fields with * are required." message:@"" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil];
                [alert show];
                
            }
        }
    }
    
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
    edit = false;
    didsign = FALSE;
    UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc]
                                   initWithTarget:self
                                   action:@selector(touchOut:)];
    [tap setCancelsTouchesInView:NO];
    [scrollview addGestureRecognizer:tap];
    // Do any additional setup after loading the view.
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc]
                                               initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]];
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    
    dob.inputView = datepick;
    medexpiry.inputView = datepick;
// 	huy code
//	set default for authens;
    if(isLoadData) {
        authens = [[NSMutableDictionary alloc] init];
        [authens setValue:@"on" forKey:@"251"];
        [authens setValue:@"on" forKey:@"252"];
        [authens setValue:@"on" forKey:@"253"];
        [authens setValue:@"on" forKey:@"254"];
    }
//	end huy code
    float sum = 0;
    servicerequired = [[NSArray alloc] initWithObjects:@"Trauma Consult", @"First Medical Certificate", @"Follow up in Perth",@"Fitness for work", nil];
    sum = 0;
    for (NSString *str in servicerequired){
        CGFloat height = 20+ [str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height;
    }
    UIView *symptomsView = [scollectionViewController.collectionView.superview.superview superview];
    NSLog(@"%@", symptomsView);
    symptomsView.frame = CGRectMake(symptomsView.frame.origin.x, symptomsView.frame.origin.y, sum, 30);
    
    servicerequired2 = [[NSArray alloc] initWithObjects:@"Initial Telehealth Consult", @"Progress Telehealth Consult", @"Transport to/from Airport", nil];
    sum = 0;
    for (NSString *str in servicerequired2){
        CGFloat height = 20+ [str sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15]].width;
        sum = sum + height;
    }
//    UIView *symptomsView2 = [scollectionViewController2.collectionView.superview.superview superview];
//    symptomsView2.frame = CGRectMake(symptomsView2.frame.origin.x, symptomsView2.frame.origin.y, sum, 30);
    
    sarrays = [[NSArray alloc] initWithObjects:servicerequired, nil];
    sarrays2 = [[NSArray alloc] initWithObjects:servicerequired2, nil];
    
    selectArray = [[NSMutableArray alloc] initWithObjects: @"no", @"no",@"no",@"no", nil];
    selectArray2 = [[NSMutableArray alloc] initWithObjects:@"yes", @"no",@"no", nil];
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [self setStyle];
    UITapGestureRecognizer *signaturetap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(tapSignature:)];
    [signaturetap setNumberOfTouchesRequired:1];
    [signaturetap setNumberOfTapsRequired:1];
    [signaturetap setDelegate:self];
    [signtxt addGestureRecognizer:signaturetap];
    [signtxt setContentMode:UIViewContentModeScaleAspectFit];
    
    if (nil!=entry){
        edit = true;
        //NSLog(@"single-%@",entry.detail);
        for (UIView *subview in [[[self view] viewWithTag:9999] subviews]) {
            /* do something with subview */
            if ((0!=subview.tag)&&(1!=subview.tag)&&(3!=subview.tag)&&(16!=subview.tag)&&(17!=subview.tag)&&(24!=subview.tag)&&(251!=subview.tag)&&(252!=subview.tag)&&(253!=subview.tag)&&(254!=subview.tag)&&(1000>subview.tag)){
                UITextField *temp = (UITextField *)subview;
                if (temp.tag == 555) { //claimno
                    [temp setText:[entry.detail objectForKey:[fields objectAtIndex:(fields.count - 2)]]];
                }else{
                    if (temp.tag == 556) { //Email
                        [temp setText:[entry.detail objectForKey:[fields objectAtIndex:(fields.count - 1)]]];
                    }else{
                        temp.text = [entry.detail objectForKey:[fields objectAtIndex:(subview.tag-1)]];
                    }
                }
                
                
                temp.inputAccessoryView  = keyboardToolbar;
            }
            
            if ((1==subview.tag)||(3==subview.tag)||(24==subview.tag)){
                UISegmentedControl *temp = (UISegmentedControl *)subview;
                temp.selectedSegmentIndex = [[entry.detail objectForKey:[fields objectAtIndex:(subview.tag-1)]] intValue]-1;
            }
            if ((16==subview.tag)||(17==subview.tag)){
                UISegmentedControl *temp = (UISegmentedControl *)subview;
                
                if (([[entry.detail objectForKey:[fields objectAtIndex:(subview.tag-1)]] isEqualToString:@"yes"]))
                    temp.selectedSegmentIndex = 1;
                else
                    temp.selectedSegmentIndex = 0;
            }
            
            
        }
        //NSLog(@"%@", entry.detail);
        for (int i=1;i<=[servicerequired count]; i++) {
            if ([[entry.detail objectForKey:[NSString stringWithFormat:@"require-%d",i]] isEqualToString:@"on"]){
                //NSLog(@"here");
                [selectArray replaceObjectAtIndex:i-1 withObject:@"yes"];
            }
        }
        for (int i=1;i<=[servicerequired2 count]; i++) {
            if ([[entry.detail objectForKey:[NSString stringWithFormat:@"require-%d",i+4]] isEqualToString:@"on"]){
                [selectArray2 replaceObjectAtIndex:i-1 withObject:@"yes"];
            }
        }
        //[data setValue:[defaults objectForKey:@"signtxt"] forKey:@"signtxt"];
    }
    
    [scollectionViewController setContentArray:[sarrays objectAtIndex:0]];
    [scollectionViewController setSelectArray:selectArray];
    [scollectionViewController.collectionView reloadData];
    [scollectionViewController2 setContentArray:[sarrays2 objectAtIndex:0]];
    [scollectionViewController2 setSelectArray:selectArray2];
    [scollectionViewController2.collectionView reloadData];

    [delegate hideActivityViewer];
    
    // add toolbar above keyboard
    if (keyboardToolbar == nil)
    {
        keyboardToolbar = [[UIToolbar alloc] initWithFrame:CGRectMake(0, 0, self.view.bounds.size.width, 44)];
        
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
            if ((0!=subview.tag)&&(1!=subview.tag)&&(3!=subview.tag)&&(16!=subview.tag)&&(17!=subview.tag)&&(24!=subview.tag)&&(251!=subview.tag)&&(252!=subview.tag)&&(253!=subview.tag)&&(254!=subview.tag)&&(1000>subview.tag)){
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
    //NSLog(@"%d-%d", index, [nextActive count]);
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

-(void)setStyle{
    for (UIView *subview in [self.scrollview subviews]) {
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
    if (isLoadData) {
        [self loadDataForView:dataView];
    }
    
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
    
    datepick.hidden = true;
    // Keyboard is no longer visible
    keyboardVisible = NO;
    
}
- (IBAction)touchOut:(id)sender{
    //NSLog(@"touchesBegan:withEvent:");
    [activeField resignFirstResponder];
    //[self.view endEditing:YES];
    //[super touchesBegan:touches withEvent:event];
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
    [datepick removeFromSuperview];

    activeField = textField;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        if (208<activeField.frame.origin.y){
            [scrollview setContentOffset:CGPointMake(0, (activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [scrollview setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
    }
    
    if ((textField.tag == 7)||(textField.tag == 22))
        datepick.hidden = FALSE;
    //NSLog(@"%f",(activeField.frame.origin.y));
    return YES;
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

-(IBAction)chooseDate:(id)sender{
    UIDatePicker *picker = (UIDatePicker *) sender;
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    if (activeField.tag == 22)
        [format setDateFormat:@"MM/yyyy"];
    else
        [format setDateFormat:@"dd/MM/yyyy"];
    activeField.text = [format stringFromDate:picker.date];
}

-(IBAction)toggleCheckboxes:(id)sender{
    if (!isLoadData) {
        UIButton *button = sender;
        [activeField resignFirstResponder];
        /*for (id key in authens) {
         
         //NSLog(@"key: %@, value: %@", key, [authens objectForKey:key]);
         
         }
         //NSLog(@"%@",[authens valueForKey:[NSString stringWithFormat:@"%d",button.tag]]);*/
        if ([[authens valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
            [button setSelected:YES];
            [authens setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
        }else{
            [button setSelected:NO];
            [authens setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
        }
    }   // Huy Code
    else {
        UIButton *button = sender;
        [activeField resignFirstResponder];
        /*for (id key in authens) {
         
         //NSLog(@"key: %@, value: %@", key, [authens objectForKey:key]);
         
         }
         //NSLog(@"%@",[authens valueForKey:[NSString stringWithFormat:@"%d",button.tag]]);*/
        if ([[authens valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
            [button setSelected:YES];
            [authens setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
        }else{
            [button setSelected:NO];
            [authens setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
        }
    }
//  End
}
- (void)tapSignature:(UIGestureRecognizer *)sender
{
    if (!isLoadData) {
        rteleSignatureViewController* vc = [self.storyboard instantiateViewControllerWithIdentifier:@"signPad"];
        vc.delegate = self;
        [self.navigationController presentViewController:vc animated:YES completion:nil];
    }
//  Huy Code
//    else {
//        rteleSignatureViewController* vc = [self.storyboard instantiateViewControllerWithIdentifier:@"signPad"];
//        vc.delegate = self;
//        [self.navigationController presentViewController:vc animated:YES completion:nil];
//    }
//  End
}
// DELEGATE METHOD - handle the message from the AddNewItem view controller
- (void) signPadController:(rteleSignatureViewController *)signPadController didSign:(NSString *)signature{
    
	// Handle the incoming data/object
	signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:signature]];
    didsign = true;
    //NSLog(@"responseStatusString %@",signature);
	// Dismiss the modal view controller
	[signPadController dismissViewControllerAnimated:YES completion:nil];
}

@end
