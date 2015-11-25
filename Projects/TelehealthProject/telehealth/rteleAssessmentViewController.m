//
//  rteleAssessmentViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 18/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleAssessmentViewController.h"
#import "rteleEntries.h"
#import "rteleEmployees.h"
#import "rteleEntry.h"
#import "rteleAppDelegate.h"
#import "constants.h"
#import "rteleEmployers.h"
#import "SBJson.h"
#import "rteleDoctors.h"
#import "NSDataAdditions.h"

@interface rteleAssessmentViewController ()<UITextViewDelegate, UIAlertViewDelegate>{
    rteleDoctor *currentDoctor;
    BOOL isFirst;
}

@end

@implementation rteleAssessmentViewController
@synthesize active;
@synthesize buttons;
@synthesize maxIndex;
@synthesize panelHeight;
@synthesize salut;
@synthesize employeeId;
@synthesize loading;
@synthesize edetail;
@synthesize webviewscontent;
@synthesize webviews;
@synthesize webviewscontentheight;
@synthesize current_y;
@synthesize activeField;
@synthesize assessments;
@synthesize type;
@synthesize activebtn;
@synthesize datepick;
@synthesize timepick;
@synthesize entry;
@synthesize passessments;
@synthesize fassessments;
@synthesize nsw_assessments;
@synthesize qld_assessments;
@synthesize tas_assessments;
@synthesize vic_assessments;
@synthesize nt_assessments;
@synthesize sa_assessments;
@synthesize state;
@synthesize popoverController;

BOOL keyboardVisible;
CGPoint offset;
CGSize keyboardSize;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        edetail.contentSize = CGSizeMake(0, 768);
    }else{
        [edetail setFrame:CGRectMake(0, 0, self.view.frame.size.height, self.view.frame.size.width)];
        edetail.contentSize = CGSizeMake(self.view.frame.size.height,
                                         self.view.frame.size.width * 2);
    }
    
    //edetail.contentOffset = CGPointMake(10,10);
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc]
                                               initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil]];
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    // general checkboxes
    assessments = [[NSMutableDictionary alloc] init];
    for (int i=120; i<=126; i++){
        [assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    // wa checkboxes (must edit here)
    assessments = [[NSMutableDictionary alloc] init];
    //    for (int i=120; i<=126; i++){
    //        [assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    //    }
    passessments = [[NSMutableDictionary alloc] init];
    for (int i=120; i<=138; i++){
        [passessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i]];
    }
    fassessments = [[NSMutableDictionary alloc] init];
    for (int i=120; i<=138; i++){
        [fassessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i]];
    }
    // nsw checkboxes
    nsw_assessments = [[NSMutableDictionary alloc] init];
    for (int i=1; i<=9; i++){
        [nsw_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    // qld checkboxes
    qld_assessments = [[NSMutableDictionary alloc] init];
    for (int i=1; i<=22; i++){
        [qld_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    // tas checkboxes
    tas_assessments = [[NSMutableDictionary alloc] init];
    for (int i=1; i<=13; i++){
        [tas_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    // vic checkboxes
    vic_assessments = [[NSMutableDictionary alloc] init];
    for (int i=1; i<=7; i++){
        [vic_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    // nt checkboxes
    nt_assessments = [[NSMutableDictionary alloc] init];
    for (int i=1; i<=25; i++){
        [nt_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",i+110]];
    }
    
    
    //[self.navigationController popViewControllerAnimated:YES];
    //employee = [[[rteleEmployees alloc] init] loadDataWithId:employeeId];
    [self performSelector:@selector(initData) withObject:nil afterDelay:0.1];
    
    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
    
    UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
    [activity.view setTag:-9999];
    CGRect frame = CGRectMake(0, 0, 1024, 768);
    activity.view.frame = frame;
    [self.view insertSubview:activity.view atIndex:99999];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:@"" forKey:@"script"];
}

- (UIImage *)stringToUIImage:(NSString *)string
{
    NSData *data = [[NSData alloc]initWithBase64EncodedString:string options:NSDataBase64DecodingIgnoreUnknownCharacters];
//    NSData *data1 = [NSData alloc] initWithBase64EncodedString:string options:nsdataba
    return [UIImage imageWithData:data];
}
-(void) fillSignImage:(UIViewController *) vc numberTag:(NSInteger) numberTag signtxt:(NSString *) signtxt{
    if (signtxt) {
        NSRegularExpression * regex = [NSRegularExpression regularExpressionWithPattern:@" " options:NSRegularExpressionCaseInsensitive error:nil];
        UIImageView *signImageView = (UIImageView *)[vc.view viewWithTag:numberTag];
        UIImage *image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:[regex stringByReplacingMatchesInString:signtxt options:0 range:NSMakeRange(0, [signtxt length]) withTemplate:@"+"]]];
        [signImageView setImage:image];
    }
}

-(void)initData{
    
    //rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    for(int i=1001; i<=maxIndex;i++){
        UIView *myView = [edetail viewWithTag:i];
        [myView removeFromSuperview];
    }
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
    maxIndex = 1000;
    current_y = 50;
    for (int i=1;i<=webviews.count;i++){
        maxIndex = 1000 +i;
        UIView *iview = [NSKeyedUnarchiver unarchiveObjectWithData:[webviews objectForKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]]];
        [self.edetail addSubview:iview];
        CGRect frame = CGRectMake(13, 50 + 43*(maxIndex-1001), 991, 35);
        iview.frame = frame;
        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
        [active setValue:@"0" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        UIButton* button = (UIButton*)[iview viewWithTag:maxIndex+1000];
        [button addTarget:nil action:@selector(toggle:) forControlEvents:UIControlEventTouchDown];
        button.frame = CGRectMake(button.frame.origin.x, button.frame.origin.y, 993, button.frame.size.height);
        UIWebView *webView = (UIWebView*)[iview viewWithTag:400];
        [webView loadHTMLString:[webviewscontent valueForKey: [NSString stringWithFormat:@"%ld",(long)maxIndex]] baseURL:nil];
        int content_height = [[webviewscontentheight valueForKey: [NSString stringWithFormat:@"%ld",(long)maxIndex]] intValue];
        CGRect rect = webView.frame;
        rect.size.height = content_height;
        rect.size.width = 991;
        webView.frame = rect;
        webView.scrollView.scrollEnabled = NO;
        webView.scrollView.bounces = NO;
        //NSLog(@"here %@", [webviewscontentheight valueForKey: [NSString stringWithFormat:@"%d",maxIndex]]);
        NSString* height = [NSString stringWithFormat:@"%d",content_height];
        [panelHeight setValue:height forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        //Create a URL object.
        current_y += 43;
    }
    [self setStyle];
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    rteleDoctor* employer = [[[rteleDoctors alloc] init] loadDataWithId:[defaults objectForKey:@"memId"]];
    
    //set current doctor
    currentDoctor = employer;
    //
    NSDate *date = [[NSDate alloc] init];
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    [dateFormatter setDateFormat:@"hh:mm"];
    NSString *timestr = [dateFormatter stringFromDate:date];
    [dateFormatter setDateFormat:@"dd/MM/yyyy"];
    NSString *datestr = [dateFormatter stringFromDate:date];
    // start assessment
    if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"1"]){
        // General assessment form for illness
        // first assessment form
        maxIndex = maxIndex+1;
        //        UIViewController* vc = [self loadForm:maxIndex withNib:@"panelfirstgeneralillness"];
        UIViewController* vc = nil;
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            vc = [self loadFormForWA:maxIndex withNib:@"GeneralAssessment"];
        }else{
            vc = [self loadFormForWA:maxIndex withNib:@"GeneralAssessment_iphone"];
        }
        [self.edetail addSubview:vc.view];
        
        CGRect frame = CGRectZero;
        
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            frame = CGRectMake(13, current_y, 991, 1052);
            [panelHeight setValue:@"1052" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
            //frame = CGRectMake(13, current_y, 991, 700);
            //[panelHeight setValue:@"698" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
        }else{
            frame = CGRectMake(13, current_y, 667, 850);
            [panelHeight setValue:@"850" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        }
        
        vc.view.frame = frame;
        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        
        //        [panelHeight setValue:@"698" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
        current_y = current_y + 43;
        //EditHere
        //        UITextField* temp = (UITextField*)[vc.view viewWithTag:18];
        //        temp.text = [employer.detail objectForKey:@"name"];
        //        temp = (UITextField*)[vc.view viewWithTag:2];
        //        temp.text = [employer.detail objectForKey:@"code"];
        //        temp = (UITextField*)[vc.view viewWithTag:3];
        //        temp.text = [employer.detail objectForKey:@"address"];
        //        temp = (UITextField*)[vc.view viewWithTag:4];
        //        temp.text = [employer.detail objectForKey:@"phone"];
        //        temp = (UITextField*)[vc.view viewWithTag:5];
        //        temp.text = [employer.detail objectForKey:@"email"];
        //        temp = (UITextField*)[vc.view viewWithTag:7];
        //        temp.text = datestr;
        //        temp = (UITextField*)[vc.view viewWithTag:8];
        //        temp.text = timestr;
        //End
        UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
        temp.text = [employer.detail objectForKey:@"name"];
        temp = (UITextField*)[vc.view viewWithTag:601];
        temp.text = [employer.detail objectForKey:@"code"];
        temp = (UITextField*)[vc.view viewWithTag:602];
        temp.text = [employer.detail objectForKey:@"address"];
        temp = (UITextField*)[vc.view viewWithTag:603];
        temp.text = [employer.detail objectForKey:@"phone"];
        temp = (UITextField*)[vc.view viewWithTag:604];
        temp.text = [employer.detail objectForKey:@"email"];
        //temp = (UITextField*)[vc.view viewWithTag:650];
        temp = (UITextField*)[vc.view viewWithTag:605];
        temp.text = datestr;
        
        [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
        
        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
        //                        temp = (UITextField*)[vc.view viewWithTag:1]; //REMOVEHERE
        //                        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:2];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:3];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:4];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:5];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:6];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:7];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:8];
        temp.inputView = datepick;
        temp = (UITextField*)[vc.view viewWithTag:9];
        temp.inputView = datepick;
        
        temp = (UITextField*)[vc.view viewWithTag:10];
        temp.inputView = timepick;
        temp = (UITextField*)[vc.view viewWithTag:11];
        temp.inputView = timepick;
        temp = (UITextField*)[vc.view viewWithTag:12];
        temp.inputView = timepick;
        temp = (UITextField*)[vc.view viewWithTag:13];
        temp.inputView = timepick;
        temp = (UITextField*)[vc.view viewWithTag:14];
        temp.inputView = timepick;
        temp = (UITextField*)[vc.view viewWithTag:15];
        temp.inputView = timepick;
        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
        if (2==type){
            NSString *title = @"Progress assessment";
            
            UILabel* temp = (UILabel*)[vc.view viewWithTag:300];
            temp.text = title;
        }
        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
            //edetail.contentSize = CGSizeMake(0, current_y+50 + 698);
            edetail.contentSize = CGSizeMake(0, current_y+50 + 1052);
        }else{
            edetail.contentSize = CGSizeMake(0, current_y+50 + 850);
        }
        
        
    }else{
        if (4==type){
            // General assessment form for injury
            maxIndex = maxIndex+1;
            //          UIViewController* vc = [self loadForm:maxIndex withNib:@"panelfirstgeneralillness"]; //EditHere
            
            UIViewController* vc = nil;
            if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                vc = [self loadFormForWA:maxIndex withNib:@"GeneralAssessment"];
            }else{
                vc = [self loadFormForWA:maxIndex withNib:@"GeneralAssessment_iphone"];
            }
            [self.edetail addSubview:vc.view];
            
            //          CGRect frame = CGRectMake(13, current_y, 991, 698); //EditHere
            CGRect frame = CGRectZero;
            if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                frame = CGRectMake(13, current_y, 991, 1052);
                [panelHeight setValue:@"1052" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                //frame = CGRectMake(13, current_y, 991, 700);
                //[panelHeight setValue:@"700" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
            }else{
                frame = CGRectMake(13, current_y, 660, 850);
                [panelHeight setValue:@"850" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
            }
            vc.view.frame = frame;
            [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
            [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
            //          [panelHeight setValue:@"700" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
            [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
            current_y = current_y + 43;
            
            //EditHere
            //            UITextField* temp = (UITextField*)[vc.view viewWithTag:18];
            //            temp.text = [employer.detail objectForKey:@"name"];
            //            temp = (UITextField*)[vc.view viewWithTag:2];
            //            temp.text = [employer.detail objectForKey:@"code"];
            //            temp = (UITextField*)[vc.view viewWithTag:3];
            //            temp.text = [employer.detail objectForKey:@"address"];
            //            temp = (UITextField*)[vc.view viewWithTag:4];
            //            temp.text = [employer.detail objectForKey:@"phone"];
            //            temp = (UITextField*)[vc.view viewWithTag:5];
            //            temp.text = [employer.detail objectForKey:@"email"];
            //            temp = (UITextField*)[vc.view viewWithTag:7];
            //            temp.text = datestr;
            //            temp = (UITextField*)[vc.view viewWithTag:8];
            //            temp.text = timestr;
            
            //End
            UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
            temp.text = [employer.detail objectForKey:@"name"];
            temp = (UITextField*)[vc.view viewWithTag:601];
            temp.text = [employer.detail objectForKey:@"code"];
            temp = (UITextField*)[vc.view viewWithTag:602];
            temp.text = [employer.detail objectForKey:@"address"];
            temp = (UITextField*)[vc.view viewWithTag:603];
            temp.text = [employer.detail objectForKey:@"phone"];
            temp = (UITextField*)[vc.view viewWithTag:604];
            temp.text = [employer.detail objectForKey:@"email"];
            //temp = (UITextField*)[vc.view viewWithTag:650];
            temp = (UITextField*)[vc.view viewWithTag:605];
            temp.text = datestr;
            
            [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
            //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
            //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
            //                        temp = (UITextField*)[vc.view viewWithTag:1]; //REMOVEHERE
            //                        temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:2];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:3];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:4];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:5];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:6];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:7];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:8];
            temp.inputView = datepick;
            temp = (UITextField*)[vc.view viewWithTag:9];
            temp.inputView = datepick;
            
            temp = (UITextField*)[vc.view viewWithTag:10];
            temp.inputView = timepick;
            temp = (UITextField*)[vc.view viewWithTag:11];
            temp.inputView = timepick;
            temp = (UITextField*)[vc.view viewWithTag:12];
            temp.inputView = timepick;
            temp = (UITextField*)[vc.view viewWithTag:13];
            temp.inputView = timepick;
            temp = (UITextField*)[vc.view viewWithTag:14];
            temp.inputView = timepick;
            temp = (UITextField*)[vc.view viewWithTag:15];
            temp.inputView = timepick;
            //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
            
//            edetail.contentSize = CGSizeMake(0, current_y+50 + 698); //EditHere
            if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                //edetail.contentSize = CGSizeMake(0, current_y+50 + 700);
                edetail.contentSize = CGSizeMake(0, current_y+50 + 1052);
            }else{
                edetail.contentSize = CGSizeMake(0, current_y+50 + 850);
            }
            
        }else{
            switch (state) {
                case 3:{ //SA Assessment Huy Edit
                    //UIViewController *vc = [self loadForm:3 withNib:@"panelassessment_SA"];
                    maxIndex++;
                    UIViewController *vc = nil;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        vc = [self loadFormForWA:maxIndex withNib:@"panelassessment_SA"];
                    }else{
                        vc = [self loadFormForWA:maxIndex withNib:@"ProgressAssessment_SA_iphone"];
                    }
                    [self.edetail addSubview:vc.view];
                    
                    CGRect frame = CGRectZero;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        frame = CGRectMake(13, current_y, 991, 2473);
                        [panelHeight setValue:@"2473" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }else{
                        frame = CGRectMake(13, current_y, 660, 1300);
                        [panelHeight setValue:@"1300" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }
                    vc.view.frame = frame;
                    
                    [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                    [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    //                    [panelHeight setValue:@"1361" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    current_y = current_y + 43;
                    
                    
                    UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
                    temp.text = [employer.detail objectForKey:@"name"];
                    temp = (UITextField*)[vc.view viewWithTag:601];
                    temp.text = [employer.detail objectForKey:@"address"];
                    temp = (UITextField*)[vc.view viewWithTag:603];
                    temp.text = [employer.detail objectForKey:@"phone"];
                    temp = (UITextField*)[vc.view viewWithTag:602];
                    temp.text = [employer.detail objectForKey:@"email"];
                    
                    UITextField *textField = (UITextField *)[vc.view viewWithTag:1];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:2];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:3];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:4];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:5];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:6];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:7];
                    textField.inputView = datepick;
                    textField = (UITextField *)[vc.view viewWithTag:94];
                    textField.inputView = datepick;
                    
                    [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 2473);
                    }else{
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1300);
                    }
                    
                    
                }
                    break;
                case 6:  // WA
                    if (1==type){
                        // first assessment form
                        maxIndex = maxIndex+1;
                        //                        UIViewController* vc = [self loadForm:maxIndex withNib:@"panelfirstassessment"]; //EditHere
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadFormForWA:maxIndex withNib:@"FirstAssessmentView"];
                        }else{
                            vc = [self loadFormForWA:maxIndex withNib:@"FirstAssessment_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
//                        CGRect frame = CGRectMake(13, current_y, 991, 1324); //EditHere
                        
                        CGRect frame = CGRectZero;
                        
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 1824);
                            [panelHeight setValue:@"1824" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 2200);
                            [panelHeight setValue:@"2200" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"1824" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        current_y = current_y + 43;
                        //EditHere
//                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
//                        temp.text = [employer.detail objectForKey:@"name"];
//                        temp = (UITextField*)[vc.view viewWithTag:600];
//                        temp.text = [employer.detail objectForKey:@"code"];
//                        temp = (UITextField*)[vc.view viewWithTag:601];
//                        temp.text = [employer.detail objectForKey:@"address"];
//                        temp = (UITextField*)[vc.view viewWithTag:602];
//                        temp.text = [employer.detail objectForKey:@"phone"];
//                        temp = (UITextField*)[vc.view viewWithTag:603];
//                        temp.text = [employer.detail objectForKey:@"email"];
//                        temp = (UITextField*)[vc.view viewWithTag:650];
//                        temp.text = datestr;
//                        temp = (UITextField*)[vc.view viewWithTag:8];
//                        temp.text = timestr;
                        //End
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:601];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:602];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:603];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:604];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:650];
                        temp.text = datestr;
                        [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
                        temp = (UITextField *)[vc.view viewWithTag:1];
                        temp.text = datestr;
                        
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
//                        temp = (UITextField*)[vc.view viewWithTag:1]; //REMOVEHERE
//                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:6];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:9];
                        temp.inputView = datepick;
                        
                        temp = (UITextField*)[vc.view viewWithTag:10];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:11];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:12];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:13];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:14];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = timepick;
                        
                        
//                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1324); //EditHere
                        
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1824);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 2200);
                        }
                    }
                    if (2==type){
                        // progress assessment form
                        maxIndex = maxIndex+1;
//                        UIViewController* vc = [self loadForm:maxIndex withNib:@"panelprogressassessment"];
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadFormForWA:maxIndex withNib:@"ProcessAssessment"];
                        }else{
                            vc = [self loadFormForWA:maxIndex withNib:@"ProcessAssessment_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
//                        CGRect frame = CGRectMake(13, current_y, 991, 1677);
                        CGRect frame = CGRectZero;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 2074);
                            [panelHeight setValue:@"2074" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 2300);
                            [panelHeight setValue:@"2300" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"2074" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        current_y = current_y + 43;
                        
                        //EditHere
//                        UITextField* temp = (UITextField*)[vc.view viewWithTag:32];
//                        temp.text = [employer.detail objectForKey:@"name"];
//                        temp = (UITextField*)[vc.view viewWithTag:2];
//                        temp.text = [employer.detail objectForKey:@"code"];
//                        temp = (UITextField*)[vc.view viewWithTag:3];
//                        temp.text = [employer.detail objectForKey:@"address"];
//                        temp = (UITextField*)[vc.view viewWithTag:4];
//                        temp.text = [employer.detail objectForKey:@"phone"];
//                        temp = (UITextField*)[vc.view viewWithTag:5];
//                        temp.text = [employer.detail objectForKey:@"email"];
//                        temp = (UITextField*)[vc.view viewWithTag:7];
//                        temp.text = datestr;
//                        temp = (UITextField*)[vc.view viewWithTag:8];
//                        temp.text = timestr;
//                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
//                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
//                        temp = (UITextField*)[vc.view viewWithTag:11];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:12];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:18];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:19];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:25];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:26];
//                        temp.inputView = timepick;
                        //End
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:601];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:602];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:603];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:604];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:650];
                        temp.text = datestr;
                        temp = (UITextField *)[vc.view viewWithTag:1];
                        temp.text = datestr;
                        
                        [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        //                        temp = (UITextField*)[vc.view viewWithTag:1]; //REMOVEHERE
                        //                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:6];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:9];
                        temp.inputView = datepick;
                        
                        temp = (UITextField*)[vc.view viewWithTag:10];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:11];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:12];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:13];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:14];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = timepick;
//                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1677); //EditHere
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 2074);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 2300);
                        }
                        
                    }
                    if (3==type){
                        // final assessment form
                        maxIndex = maxIndex+1;
//                        UIViewController* vc = [self loadForm:maxIndex withNib:@"panelfinalassessment"];
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadFormForWA:maxIndex withNib:@"FinalAssessment"];
                        }else{
                            vc = [self loadFormForWA:maxIndex withNib:@"FinalAssessment_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectZero;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 1024);
                            [panelHeight setValue:@"1024" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 1150);
                            [panelHeight setValue:@"1150" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"1024" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        
                        //EditHere
//                        UITextField* temp = (UITextField*)[vc.view viewWithTag:14];
//                        temp.text = [employer.detail objectForKey:@"name"];
//                        temp = (UITextField*)[vc.view viewWithTag:2];
//                        temp.text = [employer.detail objectForKey:@"code"];
//                        temp = (UITextField*)[vc.view viewWithTag:3];
//                        temp.text = [employer.detail objectForKey:@"address"];
//                        temp = (UITextField*)[vc.view viewWithTag:4];
//                        temp.text = [employer.detail objectForKey:@"phone"];
//                        temp = (UITextField*)[vc.view viewWithTag:5];
//                        temp.text = [employer.detail objectForKey:@"email"];
//                        temp = (UITextField*)[vc.view viewWithTag:7];
//                        temp.text = datestr;
//                        temp = (UITextField*)[vc.view viewWithTag:8];
//                        temp.text = timestr;
//                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
//                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
//                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
//                        temp = (UITextField*)[vc.view viewWithTag:9];
//                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:11];
//                        temp.inputView = datepick;
                        //End
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:600];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:601];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:602];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:603];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:604];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:650];
                        temp.text = datestr;
                        temp = (UITextField *)[vc.view viewWithTag:1];
                        temp.text = datestr;
                        
                        [self fillSignImage:vc numberTag:100 signtxt:[employer.detail objectForKey:@"drsign"]];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        //                        temp = (UITextField*)[vc.view viewWithTag:1]; //REMOVEHERE
                        //                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:6];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:9];
                        temp.inputView = datepick;
                        
                        temp = (UITextField*)[vc.view viewWithTag:10];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:11];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:12];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:13];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:14];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = timepick;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1024);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1150);
                        }
                        
                    }
                    
                    break;
                case 4: //TAS
                    if (1==type){
                        // first assessment form
                        maxIndex = maxIndex+1;
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadForm:maxIndex withNib:@"panelfirstassessment-Tasmania"];
                        }else{
                            vc = [self loadForm:maxIndex withNib:@"FirstAssessment_TAS_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectZero;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 1660);
                            [panelHeight setValue:@"1660" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 1600);
                            [panelHeight setValue:@"1600" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%d",maxIndex] forKey:[NSString stringWithFormat:@"%d",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
//                        [panelHeight setValue:@"1660" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.text = datestr;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.text = timestr;
                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                        
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        temp = (UITextField*)[vc.view viewWithTag:16];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:17];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:18];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:20];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:21];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:23];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:29];
                        temp.inputView = datepick;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1660);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1600);
                        }
                        
                        break;
                    }else{
                        // progress/final assessment form
                        maxIndex = maxIndex+1;
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadForm:maxIndex withNib:@"panelprogressfinalassessment-Tasmania"];
                        }else{
                            vc = [self loadForm:maxIndex withNib:@"ProgressAssessment_TAS_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectMake(13, current_y, 991, 1914);
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 1914);
                            [panelHeight setValue:@"1914" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 1800);
                            [panelHeight setValue:@"1800" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"1914" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.text = datestr;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.text = timestr;
                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        temp = (UITextField*)[vc.view viewWithTag:14];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:16];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:17];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:18];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:20];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:21];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:61];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:62];
                        temp.inputView = datepick;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1914);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1800);
                        }
                        
                        break;
                    }
                case 5: //VIC assessment UI
                {
                    // final assessment form
                    maxIndex = maxIndex+1;
                    UIViewController* vc = nil;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        vc = [self loadForm:maxIndex withNib:@"panelassessment-Victoria"];
                    }else{
                        vc = [self loadForm:maxIndex withNib:@"ProgressAssessment_VIC_iphone"];
                    }
                    [self.edetail addSubview:vc.view];
                    
                    CGRect frame = CGRectMake(13, current_y, 991, 2345);
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        frame = CGRectMake(13, current_y, 991, 2345);
                        [panelHeight setValue:@"2345" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }else{
                        frame = CGRectMake(13, current_y, 660, 1200);
                        [panelHeight setValue:@"1200" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }
                    vc.view.frame = frame;
                    [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                    [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    
                    UITextField* temp = (UITextField*)[vc.view viewWithTag:37];
                    temp.text = [employer.detail objectForKey:@"name"];
                    temp = (UITextField*)[vc.view viewWithTag:3];
                    temp.text = [employer.detail objectForKey:@"address"];
                    temp = (UITextField*)[vc.view viewWithTag:4];
                    temp.text = [employer.detail objectForKey:@"phone"];
                    temp = (UITextField*)[vc.view viewWithTag:5];
                    temp.text = [employer.detail objectForKey:@"email"];
                    [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                    //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                    //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                    
                    temp = (UITextField*)[vc.view viewWithTag:20];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:22];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:23];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:24];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:25];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:26];
                    temp.inputView = datepick;
                    
                    temp = (UITextField*)[vc.view viewWithTag:38];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:39];
                    temp.inputView = datepick;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 2345);
                    }else{
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1200);
                    }
                    
                    break;
                }
                case 2: //QLD
                {
                    // final assessment form
                    maxIndex = maxIndex+1;
                    UIViewController* vc = nil;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        vc = [self loadForm:maxIndex withNib:@"panelassessment-QLD"];
                    }else{
                        vc = [self loadForm:maxIndex withNib:@"ProgressAssessment_QLD_iphone"];
                    }
                    [self.edetail addSubview:vc.view];
                    
                    CGRect frame = CGRectMake(13, current_y, 991, 1969);
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        frame = CGRectMake(13, current_y, 991, 1969);
                        [panelHeight setValue:@"1969" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }else{
                        frame = CGRectMake(13, current_y, 660, 2000);
                        [panelHeight setValue:@"2000" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    }
                    vc.view.frame = frame;
                    [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                    [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    //                    [panelHeight setValue:@"1969" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                    UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                    temp.text = [employer.detail objectForKey:@"name"];
                    temp = (UITextField*)[vc.view viewWithTag:2];
                    temp.text = [employer.detail objectForKey:@"code"];
                    temp = (UITextField*)[vc.view viewWithTag:3];
                    temp.text = [employer.detail objectForKey:@"address"];
                    temp = (UITextField*)[vc.view viewWithTag:4];
                    temp.text = [employer.detail objectForKey:@"phone"];
                    temp = (UITextField*)[vc.view viewWithTag:5];
                    temp.text = [employer.detail objectForKey:@"email"];
                    temp = (UITextField*)[vc.view viewWithTag:7];
                    temp.text = datestr;
                    temp = (UITextField*)[vc.view viewWithTag:8];
                    temp.text = timestr;
                    [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                    //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                    //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                    temp = (UITextField*)[vc.view viewWithTag:12];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:13];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:14];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:15];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:16];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:18];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:19];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:20];
                    temp.inputView = datepick;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1969);
                    }else{
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 2000);
                    }
                    
                    break;
                }
                case 1: //NT assessment UI
                {
                    if (1==type){
                        // final assessment form
                        maxIndex = maxIndex+1;
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadForm:maxIndex withNib:@"panelfirstassessment-NT"];
                        }else{
                            vc = [self loadForm:maxIndex withNib:@"FirstAssessment_NT_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectMake(13, current_y, 991, 2116);
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 2116);
                            [panelHeight setValue:@"2116" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 2200);
                            [panelHeight setValue:@"2200" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"2116" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.text = datestr;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.text = timestr;
                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:16];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:19];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:20];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:22];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:23];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:26];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:30];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:31];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:40];
                        temp.inputView = datepick;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 2116);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 2200);
                        }
                        
                    }
                    if (2==type){
                        // final assessment form
                        maxIndex = maxIndex+1;
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            vc = [self loadForm:maxIndex withNib:@"panelprogressassessment-NT"];
                        }else{
                            vc = [self loadForm:maxIndex withNib:@"ProgressAssessment_NT_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectMake(13, current_y, 991, 1857);
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 1857);
                            [panelHeight setValue:@"1857" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 1600);
                            [panelHeight setValue:@"1600" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%ld",(long)maxIndex] forKey:[NSString stringWithFormat:@"%ld",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        //                        [panelHeight setValue:@"1737" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%ld",(long)maxIndex]];
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.text = datestr;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.text = timestr;
                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        
                        temp = (UITextField*)[vc.view viewWithTag:11];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:14];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:15];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:20];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:21];
                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:22];
                        temp.inputView = datepick;
//                        temp = (UITextField*)[vc.view viewWithTag:31];
//                        temp.inputView = datepick;
                        temp = (UITextField*)[vc.view viewWithTag:32];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:35];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:33];
                        temp.inputView = datepick;
                        
//                        huy edit
                        temp = (UITextField*)[vc.view viewWithTag:41];
                        temp.inputView = timepick;
                        temp = (UITextField*)[vc.view viewWithTag:40];
                        temp.inputView = datepick;
//                        end huy edit
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1857);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 1600);
                        }
                        
                    }
                    if (3==type){
                        // final assessment form
                        maxIndex = maxIndex+1;
                        UIViewController* vc = nil;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] ==  UIUserInterfaceIdiomPad) {
                            vc = [self loadForm:maxIndex withNib:@"panelfinalassessment-NT"];
                        }else{
                            vc = [self loadForm:maxIndex withNib:@"FinalAssessment_NT_iphone"];
                        }
                        [self.edetail addSubview:vc.view];
                        
                        CGRect frame = CGRectMake(13, current_y, 991, 584);
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            frame = CGRectMake(13, current_y, 991, 584);
                            [panelHeight setValue:@"584" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        }else{
                            frame = CGRectMake(13, current_y, 660, 700);
                            [panelHeight setValue:@"700" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        }
                        vc.view.frame = frame;
                        [buttons setValue:[NSString stringWithFormat:@"%d",maxIndex] forKey:[NSString stringWithFormat:@"%d",maxIndex+1000]];
                        [active setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
//                        [panelHeight setValue:@"584" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                        UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                        temp.text = [employer.detail objectForKey:@"name"];
                        temp = (UITextField*)[vc.view viewWithTag:2];
                        temp.text = [employer.detail objectForKey:@"code"];
                        temp = (UITextField*)[vc.view viewWithTag:3];
                        temp.text = [employer.detail objectForKey:@"address"];
                        temp = (UITextField*)[vc.view viewWithTag:4];
                        temp.text = [employer.detail objectForKey:@"phone"];
                        temp = (UITextField*)[vc.view viewWithTag:5];
                        temp.text = [employer.detail objectForKey:@"email"];
                        temp = (UITextField*)[vc.view viewWithTag:7];
                        temp.text = datestr;
                        temp = (UITextField*)[vc.view viewWithTag:8];
                        temp.text = timestr;
                        [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"] ];
                        //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                        //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                        temp = (UITextField*)[vc.view viewWithTag:9];
                        temp.inputView = datepick;
                        if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 584);
                        }else{
                            edetail.contentSize = CGSizeMake(0, current_y+50 + 700);
                        }
                        
                    }
                    break;
                }
                case 0: //NSW
                {
                    // final assessment form
                    maxIndex = maxIndex+1;
                    UIViewController* vc = nil;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        vc = [self loadForm:maxIndex withNib:@"panelassessmentnsw"];
                    }else{
                        vc = [self loadForm:maxIndex withNib:@"ProgressAssessment_NSW_iphone"];
                    }
                    [self.edetail addSubview:vc.view];
                    
                    CGRect frame = CGRectMake(13, current_y, 991, 1714);
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        frame = CGRectMake(13, current_y, 991, 1714);
                        [panelHeight setValue:@"1714" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    }else{
                        frame = CGRectMake(13, current_y, 660, 1800);
                        [panelHeight setValue:@"1800" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    }
                    vc.view.frame = frame;
                    [buttons setValue:[NSString stringWithFormat:@"%d",maxIndex] forKey:[NSString stringWithFormat:@"%d",maxIndex+1000]];
                    [active setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
//                    [panelHeight setValue:@"1714" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    [loading setValue:@"1" forKey:[NSString stringWithFormat:@"%d",maxIndex]];
                    UITextField* temp = (UITextField*)[vc.view viewWithTag:28];
                    temp.text = [employer.detail objectForKey:@"name"];
                    temp = (UITextField*)[vc.view viewWithTag:2];
                    temp.text = [employer.detail objectForKey:@"code"];
                    temp = (UITextField*)[vc.view viewWithTag:3];
                    temp.text = [employer.detail objectForKey:@"address"];
                    temp = (UITextField*)[vc.view viewWithTag:4];
                    temp.text = [employer.detail objectForKey:@"phone"];
                    temp = (UITextField*)[vc.view viewWithTag:5];
                    temp.text = [employer.detail objectForKey:@"email"];
                    temp = (UITextField*)[vc.view viewWithTag:7];
                    temp.text = datestr;
                    temp = (UITextField*)[vc.view viewWithTag:8];
                    temp.text = timestr;
                    [self fillSignImage:vc numberTag:6 signtxt:[employer.detail objectForKey:@"drsign"]];
                    //UIImageView* signtxt = (UIImageView*)[vc.view viewWithTag:6];
                    //signtxt.image = [UIImage imageWithData:[NSData dataWithBase64EncodedString:employer.d]];
                    temp = (UITextField*)[vc.view viewWithTag:16];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:17];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:20];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:21];
                    temp.inputView = datepick;
                    temp = (UITextField*)[vc.view viewWithTag:33];
                    temp.inputView = datepick;
                    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1714);
                    }else{
                        edetail.contentSize = CGSizeMake(0, current_y+50 + 1800);
                    }
                    
                    break;
                }
                default:
                    break;
            }
        }
    }
    [(UILabel*)[edetail viewWithTag:111] setText:[NSString stringWithFormat:@" Assessment for %@ %@",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]]];
    [[self.view viewWithTag:-9999] removeFromSuperview];
}

-(UIViewController*)loadForm:(NSInteger)tag withNib:(NSString*) name{
    // Load MyView.nib into the myView outlet.
    // Take ownership.
    UIViewController * viewController = [[UIViewController alloc] initWithNibName:name bundle:nil];
    [viewController.view setTag:tag];
    UIButton* button = (UIButton*)[viewController.view viewWithTag:200];
    [button addTarget:nil action:@selector(toggle:) forControlEvents:UIControlEventTouchDown];
    
    [button setTag:tag+1000];
    
    [[[viewController.view  viewWithTag:999] layer] setCornerRadius:9.0];
    //set ground corners for view
    [[viewController.view  layer] setCornerRadius:12.0];
    [[viewController.view  layer] setBorderWidth:1.0];
    [[viewController.view  layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
    
    for (UIView *subview in [viewController.view subviews]) {
        if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)&&(10!=subview.tag)){
            // 300 panel's label, 200 panel's tab, 6 signature, 0 labels, 999 plus sign, >100 checkboxes
            if ((100>subview.tag)) {
                UITextField *temp = (UITextField *)subview;
                
                //NSLog(@"%@", ((UILabel*)subview).text);
                temp.delegate = self;
                //NSLog(@"%d", subview.tag);
                if (7==temp.tag){
                    temp.inputView = datepick;
                }
                if (8==temp.tag){
                    temp.inputView = timepick;
                }
            }else{
                UIButton* temp = (UIButton*) subview;
                [temp addTarget:nil action:@selector(toggleCheckboxes:) forControlEvents:UIControlEventTouchDown];
            }
        }
        if ((800==subview.tag)) {
            UIButton* btn = (UIButton*)subview;
            [btn addTarget:nil action:@selector(submit:) forControlEvents:UIControlEventTouchDown];
        }
        if ((900==subview.tag)) {
            UIButton* btn = (UIButton*)subview;
            [btn addTarget:self action:@selector(writescript:) forControlEvents:UIControlEventTouchDown];
        }
        if (subview.tag >= 551 && subview.tag <= 586) { //Radio button ( 3 )
            UIButton *temp = (UIButton *) subview;
            [temp addTarget:self action:@selector(radioButtonTouchDown:) forControlEvents:UIControlEventTouchDown];
        }
        if (subview.tag >= 551 && subview.tag <= 586) { //Radio button ( 3 )
            UIButton *temp = (UIButton *) subview;
            [temp addTarget:self action:@selector(radioButtonTouchDown:) forControlEvents:UIControlEventTouchDown];
        }
        if (subview.tag >= 29 && subview.tag <= 36) {
            UITextView *textView = (UITextView *) subview;
            [textView setDelegate:self];
        }
    }
    return viewController;
}

-(UIViewController*)loadFormForWA:(NSInteger)tag withNib:(NSString*) name{
    // Load MyView.nib into the myView outlet.
    // Take ownership.
    UIViewController * viewController = [[UIViewController alloc] initWithNibName:name bundle:nil];
    [viewController.view setTag:tag];
    [viewController.view setClipsToBounds:YES];
    UIButton* button = (UIButton*)[viewController.view viewWithTag:200];
    [button addTarget:nil action:@selector(toggle:) forControlEvents:UIControlEventTouchDown];
    
    [button setTag:tag+1000];
    
    [[[viewController.view  viewWithTag:999] layer] setCornerRadius:9.0];
    //set ground corners for view
    [[viewController.view  layer] setCornerRadius:12.0];
    [[viewController.view  layer] setBorderWidth:1.0];
    [[viewController.view  layer] setBorderColor:[[UIColor lightGrayColor] CGColor]];
    
    for (UIView *subview in [viewController.view subviews]) {
        if (subview.tag == 999 || subview.tag == 998) {
            NSLog(@"%lu",(unsigned long)subview.subviews.count);
            for (UIView *view in subview.subviews) {
                NSLog(@"%lu",(unsigned long)view.subviews.count);
                //radio button
                for (UIView *subView2 in view.subviews) {
                    if ([subView2 isKindOfClass:[UIButton class]]) {
                        UIButton *button = (UIButton *) subView2;
                        [button addTarget:self action:@selector(radioButtonTouchDown:) forControlEvents:UIControlEventTouchDown];
                    }
                    //textfield
                    if ([subView2 isKindOfClass:[UITextField class]]) {
                        UITextField *temp = (UITextField *) subView2;
                        [temp setDelegate:self];
                    }
                }
            }
            continue;
        }
        
        if ((0!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)){
            // 300 panel's label, 200 panel's tab, 6 signature, 0 labels, 999 plus sign, >100 checkboxes
            if ((100>subview.tag || subview.tag == 650)) {
                UITextField *temp = (UITextField *)subview;
                
                //NSLog(@"%@", ((UILabel*)subview).text);
                temp.delegate = self;
                //NSLog(@"%d", subview.tag);
                if ((temp.tag >= 1 && temp.tag <= 9) || (temp.tag == 650)) {
                    temp.inputView = datepick;
                }
                if (temp.tag >= 10 && temp.tag <= 19) {
                    temp.inputView = timepick;
                }
            }else{
                if ((subview.tag >500 && subview.tag < 550 ) || ((subview.tag >= 600 && subview.tag < 700) && subview.tag != 650)) {
                    UITextView *textView = (UITextView *) subview;
                    [textView setDelegate:self];
                    
                }else{ // checkbox
                    if (subview.tag >= 550 && subview.tag <= 599) { //Radio button ( 3 )
                        UIButton *temp = (UIButton *) subview;
                        [temp addTarget:self action:@selector(radioButtonTouchDown:) forControlEvents:UIControlEventTouchDown];
                    }else{ //Checkbox
                        if (subview.tag != 100) { // signature
                            UIButton* temp = (UIButton*) subview;
                            [temp addTarget:nil action:@selector(toggleCheckboxes:) forControlEvents:UIControlEventTouchDown];
                        }
                    }
                }
                
            }
        }
        
        if ((800==subview.tag)) {
            UIButton* btn = (UIButton*)subview;
            [btn addTarget:nil action:@selector(submit:) forControlEvents:UIControlEventTouchDown];
        }
        if ((900==subview.tag)) {
            UIButton* btn = (UIButton*)subview;
            [btn addTarget:self action:@selector(writescript:) forControlEvents:UIControlEventTouchDown];
        }
    }
    return viewController;
}
-(IBAction)submit:(id)sender{
    UIView *backgroundView = [[UIView alloc] initWithFrame:self.view.bounds];
    [backgroundView setBackgroundColor:[UIColor colorWithRed:192/255.0 green:192/255.0 blue:192/255.0 alpha:0.8]];
    [backgroundView setTag:9999];
    [self.view addSubview:backgroundView];
    //
    //[edetail setContentOffset:CGPointMake(0,0) animated:YES];
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(edetail.contentOffset.x,edetail.contentOffset.y,edetail.contentSize.width,edetail.contentSize.height)];
    [activeField resignFirstResponder];
    [self.activeView resignFirstResponder];
    [self performSelector:@selector(updateDeffered) withObject:nil afterDelay:0.5];
}
-(IBAction)writescript:(id)sender{
    UIViewController* test = [[UIViewController alloc] init];
    test.view = [[UIView alloc] initWithFrame:CGRectMake(0, 0, 600, 400)];
    [test.view setBackgroundColor:[UIColor whiteColor]];
    //[scrollview addSubview:imageView];
    UIToolbar *toolbar=[[UIToolbar alloc] initWithFrame:CGRectMake(0, 0,600 ,44)];
    toolbar.barStyle =UIBarStyleBlackTranslucent;
    UIBarButtonItem *cancel=[[UIBarButtonItem alloc ]initWithTitle:@"Done" style:UIBarButtonItemStyleBordered target:self action:@selector(doSubmitScript:)];
    //toolbar.userInteractionEnabled = true;
    [test.view setUserInteractionEnabled:true];
    
    [cancel setTag:((UIButton*)sender).tag];
    UIBarButtonItem *item = [[UIBarButtonItem alloc] initWithTitle:@"Script"
                                                             style:UIBarButtonItemStylePlain
                                                            target:nil
                                                            action:nil];
    
    UIBarButtonItem *spacer = [[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemFlexibleSpace
                                                                            target:nil
                                                                            action:nil];
    
    NSArray *items = [[NSArray alloc] initWithObjects:cancel, spacer, item, spacer, nil];
    
    [toolbar setItems:items];
    [test.view addSubview:toolbar];
    // add fields
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(5, 55, 150, 35)];
    label.text =  @"PBS:";
    [test.view addSubview:label];
    NSArray *itemArray = [NSArray arrayWithObjects: @"No", @"Yes", nil];
    UISegmentedControl *segmentedControl = [[UISegmentedControl alloc] initWithItems:itemArray];
    segmentedControl.frame = CGRectMake(60, 60, 80, 25);
    segmentedControl.segmentedControlStyle = UISegmentedControlStyleBar;
    segmentedControl.selectedSegmentIndex = 0;
    [segmentedControl setTag:101];
    [test.view addSubview:segmentedControl];
    //
    label = [[UILabel alloc] initWithFrame:CGRectMake(150, 55, 150, 35)];
    label.text =  @"RPBS:";
    [test.view addSubview:label];
    segmentedControl = [[UISegmentedControl alloc] initWithItems:itemArray];
    segmentedControl.frame = CGRectMake(215, 60, 80, 25);
    segmentedControl.segmentedControlStyle = UISegmentedControlStyleBar;
    segmentedControl.selectedSegmentIndex = 0;
    [segmentedControl setTag:102];
    [test.view addSubview:segmentedControl];
    
    //
    label = [[UILabel alloc] initWithFrame:CGRectMake(5, 95, 300, 35)];
    label.text =  @"Brand substitution not permitted:";
    [test.view addSubview:label];
    segmentedControl = [[UISegmentedControl alloc] initWithItems:itemArray];
    segmentedControl.frame = CGRectMake(290, 100, 80, 25);
    segmentedControl.segmentedControlStyle = UISegmentedControlStyleBar;
    segmentedControl.selectedSegmentIndex = 0;
    [segmentedControl setTag:103];
    [test.view addSubview:segmentedControl];
    //
    label = [[UILabel alloc] initWithFrame:CGRectMake(5, 140, 150, 35)];
    label.text =  @"Script:";
    [test.view addSubview:label];
    UITextView* textfield = [[UITextView alloc] initWithFrame:CGRectMake(70, 143,500 ,170)];
    textfield.contentInset = UIEdgeInsetsMake(5,5,5,5);
    [textfield.layer setBackgroundColor: [[UIColor whiteColor] CGColor]];
    [textfield.layer setBorderColor: [[UIColor grayColor] CGColor]];
    [textfield.layer setBorderWidth: 1.0];
    [textfield.layer setCornerRadius:8.0f];
    [textfield.layer setMasksToBounds:YES];
    [textfield setTag:100];
    [test.view addSubview:textfield];
    
    label = [[UILabel alloc] initWithFrame:CGRectMake(5, 330, 370, 35)];
    label.text = @"Please fill in the script and hit Done.";
    label.tag = 300;
    [label setTextAlignment:NSTextAlignmentCenter];
    [label setTextColor:[UIColor redColor]];
    [test.view addSubview:label];
    
    popoverController=[[UIPopoverController alloc] initWithContentViewController:test];
    popoverController.delegate=self;
    popoverController.popoverContentSize=CGSizeMake(600, 400);
    [popoverController presentPopoverFromRect:((UIButton *)sender).frame inView:self.view permittedArrowDirections:UIPopoverArrowDirectionDown animated:YES];
}
-(IBAction)doSubmitScript:(id)sender{
    [UIView beginAnimations:nil context:nil];
    [UIView setAnimationDuration:0.5];
    [UIView commitAnimations];
    NSString *script = ((UITextField*)[popoverController.contentViewController.view viewWithTag:100]).text;
    
    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
    
    UIViewController *activity = [storyboard instantiateViewControllerWithIdentifier:@"activity"];
    CGRect frame = CGRectMake(0, 0, 600, 400);
    activity.view.frame = frame;
    [activity.view setNeedsLayout];
    [popoverController.contentViewController.view insertSubview:activity.view atIndex:99999];
    //NSLog(@"%@",script);
    //[self performSelector:@selector(doChangePassDeferred:) withObject:script afterDelay:0.5];
    
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [defaults setValue:script forKey:@"script"];
    UISegmentedControl *temp = (UISegmentedControl *)((UITextField*)[popoverController.contentViewController.view viewWithTag:101]);
    
    [defaults setValue:[NSString stringWithFormat:@"%d",(temp.selectedSegmentIndex+1)] forKey:@"PBS"];
    
    temp = (UISegmentedControl *)((UITextField*)[popoverController.contentViewController.view viewWithTag:102]);
    [defaults setValue:[NSString stringWithFormat:@"%d",(temp.selectedSegmentIndex+1)] forKey:@"RPBS"];
    temp = (UISegmentedControl *)((UITextField*)[popoverController.contentViewController.view viewWithTag:103]);
    [defaults setValue:[NSString stringWithFormat:@"%d",(temp.selectedSegmentIndex+1)] forKey:@"Other"];
    [defaults setValue:script forKey:@"script"];
    
    [popoverController dismissPopoverAnimated:YES];
}


-(void)updateDeffered{
    NSMutableDictionary* json = [[NSMutableDictionary alloc] init];
    for (NSString* key in [entry.detail allKeys]){
        [json setValue:[entry.detail objectForKey:key] forKey:key];
    }
    if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"1"]){
        // general illness
        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)){
                if (subview.tag >= 600 || subview.tag == 100/*sign */) { //info
                    if (subview.tag == 100) { //Sign
                        // Tim cach fix cho nay, Tim chu ky that
                        // [json setValue:@"Sign" forKey:[assessment_fields_info objectAtIndex:5]];
                        [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                    }else{
                        //
                        if (subview.tag < 650 && subview.tag > 0) {
                            NSInteger index = -1;
//                            if (subview.tag == 650) {//Date
                            if (subview.tag == 605) {//Date
                                index = 6;
                            }else{
                                index = subview.tag % 600;
                            }
                            UITextField *temp = (UITextField *)subview;
                            [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:index]];
                        }
                        
                    }
                }
                else{ //informal information
//                    UITextField *temp = (UITextField *) subview;
//                    [json setValue:temp.text forKey:[general_assessment_fields objectAtIndex:(temp.tag % 20)]];
                    if(subview.tag >= 120 && subview.tag <= 126) {
                        UIButton *button = (UIButton *) subview;
                        if (button.selected) {
                            [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(button.tag%120)]];
                        }
                        else{
                            [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(button.tag%120)]];
                        }
                        if(subview.tag == 125) {
                            if (button.selected) {
                                [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(5)]];
                            }
                            else{
                                [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(5)]];
                            }
                        }
                        if(subview.tag == 126) {
                            if (button.selected) {
                                [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(6)]];
                            }
                            else{
                                [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(6)]];
                            }
                        }
                    }
                    if(subview.tag >= 2 && subview.tag <= 8) {
                        UITextField *temp = (UITextField *) subview;
                        if(temp.tag == 2) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(0)]];
                        }
                        if(temp.tag == 3) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(1)]];
                        }
                        if(temp.tag == 4) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(2)]];
                        }
                        if(temp.tag == 5) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(3)]];
                        }
                        if(temp.tag == 8) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(4)]];
                        }
                        if(temp.tag == 7) {
                            [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(5)]];
                        }
                    }
                    if (subview.tag >= 20 && subview.tag <= 25) { //textview
                        UITextView *temp = (UITextView *) subview;
                        [json setValue:temp.text forKey:[general_assessment_textview objectAtIndex:(subview.tag % 20)]];
                        continue;
                    }
                }
            }
        }
    }else{
        // injury
        if (4 == type) {
            [json setValue:@"General Assessment" forKey:@"nameReport"];
            for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)){
                    if ((subview.tag >= 600 && subview.tag < 800) || subview.tag == 100/*sign */) { //info
                        if (subview.tag == 100) { //Sign
                            // Tim cach fix cho nay, Tim chu ky that
                            // [json setValue:@"Sign" forKey:[assessment_fields_info objectAtIndex:5]];
                            [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                        }else{
                            //
                            if (subview.tag < 650 && subview.tag > 0) {
                                NSInteger index = -1;
//                                if (subview.tag == 650) {//Date
                                if (subview.tag == 605) {//Date
                                    index = 6;
                                }else{
                                    index = subview.tag % 600;
                                }
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:index]];
                            }
                        }
                    }
                    else{ //informal information
//old code
//                        if (subview.tag > 0 && subview.tag < 100) {
//                            
//                            UITextField *temp = (UITextField *) subview;
//                            
//                            [json setValue:temp.text forKey:[general_assessment_fields objectAtIndex:(temp.tag % 20)]];
//                            
//                        }
                          // Huy code
                            if(subview.tag >= 120 && subview.tag <= 126) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }
                                else{
                                    [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }
                                if(subview.tag == 125) {
                                    if (button.selected) {
                                        [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(5)]];
                                    }
                                    else{
                                        [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(5)]];
                                    }
                                }
                                if(subview.tag == 126) {
                                    if (button.selected) {
                                        [json setValue:@"yes" forKey:[general_assessment_checkbox objectAtIndex:(6)]];
                                    }
                                    else{
                                        [json setValue:@"no" forKey:[general_assessment_checkbox objectAtIndex:(6)]];
                                    }
                                }
                            }
                            if(subview.tag >= 2 && subview.tag <= 8) {
                                UITextField *temp = (UITextField *) subview;
                                if(temp.tag == 2) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(0)]];
                                }
                                if(temp.tag == 3) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(1)]];
                                }
                                if(temp.tag == 4) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(2)]];
                                }
                                if(temp.tag == 5) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(3)]];
                                }
                                if(temp.tag == 8) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(4)]];
                                }
                                if(temp.tag == 7) {
                                    [json setValue:temp.text forKey:[general_assessment_datefield objectAtIndex:(5)]];
                                }
                            }
                            if (subview.tag >= 20 && subview.tag <= 25) { //textview
                                UITextView *temp = (UITextView *) subview;
                                [json setValue:temp.text forKey:[general_assessment_textview objectAtIndex:(subview.tag % 20)]];
                                continue;
                            }
                    }
                }
            }
            if(4==type || 3==state || 1==state) {
                [json setValue:@"4" forKey:@"typeReport"];
            }
        } else {
            switch (state) {
                case 3:{ //SA AssessmentinsertDB
                    NSLog(@"type %d", type);
                    if (2==type) {
                        [json setValue:@"Progress Assessment" forKey:@"nameReport"];
                    }
                    for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                        if ((subview.tag >= 600 && subview.tag < 800) || subview.tag == 100/*sign */) { //info
                            if (subview.tag == 100) { //Sign
                                //Tim cach fix cho nay, Tim chu ky that
                                //                                    [json setValue:@"Sign" forKey:[assessment_fields_info objectAtIndex:5]];
                                [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                            } else {
                                UITextField *temp = (UITextField *)subview;
                                if (subview.tag == 600) {
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:(0)]];
                                } else if (subview.tag == 601) {
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:(2)]];
                                } else if (subview.tag == 602) {
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:(4)]];
                                } else if (subview.tag == 603) {
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:(3)]];
                                }
                                
                            }
                            continue;
                        }
                        //
                        //                        if (subview.tag >= 550 && subview.tag < 600) { //radio button
                        //                            UIButton *radioButton = (UIButton *) subview;
                        //                            if (radioButton.tag>= 555) {
                        //                                if (radioButton.selected) {
                        //                                    [json setValue:@"yes" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 555 + 3)]];
                        //                                }else{
                        //                                    [json setValue:@"no" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 555 + 3)]];
                        //                                }
                        //                            }else{
                        //                                if (radioButton.selected) {
                        //                                    [json setValue:@"yes" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                        //                                }else{
                        //                                    [json setValue:@"no" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                        //                                }
                        //                            }
                        //
                        //continue;
                        //}
                        //if (subview.tag > 500 && subview.tag < 510) { //textview
                        //UITextView *temp = (UITextView *) subview;
                        //[json setValue:temp.text forKey:[sa_assessment_textview objectAtIndex:(subview.tag % 500 - 1)]];
                        //continue;
                        //}
                        
                        if (subview.tag >= 550 && subview.tag < 600) { //radio button
                            UIButton *radioButton = (UIButton *) subview;
                            if (radioButton.tag >=551 && radioButton.tag <= 554) {
                                if (radioButton.selected) {
                                    [json setValue:@"yes" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag - 551)]];
                                } else {
                                    [json setValue:@"no" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag - 551)]];
                                }
                            } else if (subview.tag >= 560 && subview.tag <= 598) {
                                if (radioButton.selected) {
                                    int x = (subview.tag - 560) / 3;
                                    [json setValue:radioButton.titleLabel.text forKey:[sa_assessment_radio objectAtIndex:(x + 6)]];
                                }
                            }
                            //if (radioButton.tag>= 555) {
                            //if (radioButton.selected) {
                            //[json setValue:@"yes" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 555 + 3)]];
                            //}else{
                            //[json setValue:@"no" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 555 + 3)]];
                            //}
                            //}else{
                            //if (radioButton.selected) {
                            //[json setValue:@"yes" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                            //}else{
                            //[json setValue:@"no" forKey:[sa_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                            //}
                            //}
                            continue;
                        }
                        if (subview.tag >= 501 && subview.tag <= 508) { //textview
                            UITextView *temp = (UITextView *) subview;
                            [json setValue:temp.text forKey:[sa_assessment_textview objectAtIndex:(subview.tag - 501)]];
                            continue;
                        }
                        
                        //textfield
                        if (subview.tag >= 1 && subview.tag < 100) {
                            NSLog(@"tag: %ld", (long)subview.tag);
                            UITextField *temp = (UITextField *) subview;
                            if (subview.tag <= 8) { //textfield date
                                [json setValue:temp.text forKey:[sa_assessment_textfield objectAtIndex:(subview.tag - 1)]];
                            }
                            else if(subview.tag >= 20 && subview.tag <= 30){ //textfield text(20,30)
                                [json setValue:temp.text forKey:[sa_assessment_textfield objectAtIndex:(subview.tag - 12)]];
                            }
                            if(subview.tag == 92) {
                                [json setValue:temp.text forKey:[sa_assessment_textfield objectAtIndex:(19)]];
                            } else if(subview.tag == 93) {
                                [json setValue:temp.text forKey:[sa_assessment_textfield objectAtIndex:(20)]];
                            } else if (subview.tag == 94) {
                                [json setValue:temp.text forKey:[sa_assessment_textfield objectAtIndex:(21)]];
                            }
                        }
                        //checkbox
                        if (subview.tag >= 120 && subview.tag <= 400 && subview.tag != 300) {
                            UIButton *button = (UIButton *) subview;
                            if (subview.tag >= 120 && subview.tag <= 142) {
                                if(button.selected) {
                                    [json setValue:@"yes" forKey:[sa_assessment_checkbox objectAtIndex:(button.tag - 120)]];
                                } else {
                                    [json setValue:@"no" forKey:[sa_assessment_checkbox objectAtIndex:(button.tag - 120)]];
                                }
                            } else if (subview.tag == 144) {
                                if(button.selected) {
                                    [json setValue:@"yes" forKey:[sa_assessment_checkbox objectAtIndex:(23)]];
                                } else {
                                    [json setValue:@"no" forKey:[sa_assessment_checkbox objectAtIndex:(23)]];
                                }
                            }  else if (subview.tag == 145) {
                                if(button.selected) {
                                    [json setValue:@"yes" forKey:[sa_assessment_checkbox objectAtIndex:(24)]];
                                } else {
                                    [json setValue:@"no" forKey:[sa_assessment_checkbox objectAtIndex:(24)]];
                                }
                            }
                            //if (button.tag == 138) {
                            //NSLog(@"");
                            //}
                            //if (button.selected) {
                            //[json setValue:@"yes" forKey:[sa_assessment_checkbox objectAtIndex:(button.tag%120)]];
                            //}
                            //else{
                            //[json setValue:@"no" forKey:[sa_assessment_checkbox objectAtIndex:(button.tag%120)]];
                            //}
                        }
                        
                    }
                }
                    break;
                case 6:
                    if (1==type) { //First Assessment
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            //textfield in
                            if (subview.tag == 999) { //subview textfield
                                for (UIView *view in subview.subviews) {
                                    for (UIView *subView2 in view.subviews) {
                                        if (subView2.tag != 0) {
                                            UITextField *temp = (UITextField *) subView2;
                                            [json setValue:temp.text forKey:[first_assessment_fields_subtextfield objectAtIndex:(subView2.tag % 28)]];
                                        }
                                    }
                                }
                                continue;
                            }
                            
                            if ((subview.tag >= 600 && subview.tag < 800) || subview.tag == 100/*sign */) { //info
                                if (subview.tag == 100) { //Sign
                                    //Tim cach fix cho nay, Tim chu ky that
                                    [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                                }else{
                                    NSInteger index = -1;
                                    NSLog(@"%d",subview.tag);
                                    if (subview.tag == 650) {//Date
                                        index = 6;
                                    }else{
                                        index = subview.tag % 600;
                                    }
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:index]];
                                }
                                continue;
                            }
                            
                            if (subview.tag >= 550 && subview.tag < 600) { //radio button
                                UIButton *radioButton = (UIButton *) subview;
                                if (radioButton.selected) {
                                    [json setValue:@"yes" forKey:[first_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                                }else{
                                    [json setValue:@"no" forKey:[first_assessment_radio objectAtIndex:(radioButton.tag % 550)]];
                                }
//                                if (radioButton.selected) {
//                                    if (radioButton.tag % 550 < 3) {
//                                        [json setValue:@"yes" forKey:[first_assessment_radio objectAtIndex:0]];
//                                    }else{
//                                        [json setValue:@"yes" forKey:[first_assessment_radio objectAtIndex:1]];
//                                    }
//                                }
                                continue;
                            }
                            if (subview.tag > 500 && subview.tag < 510) { //textview
                                UITextView *temp = (UITextView *) subview;
                                [json setValue:temp.text forKey:[first_assessment_textview objectAtIndex:(subview.tag % 500 - 1)]];
                                continue;
                            }
                            if (/*(0!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)*/subview.tag >= 1 && subview.tag < 100){
                                UITextField *temp = (UITextField *) subview;
                                if (subview.tag < 20) { //textfield date
                                    [json setValue:temp.text forKey:[first_assessment_datefield objectAtIndex:(subview.tag - 1)]];
                                }else{ //textfield text
                                    [json setValue:temp.text forKey:[first_assessment_fields objectAtIndex:(subview.tag %20)]];
                                }
                                
                            }
                            //checkbox
                            if (subview.tag >= 120 && subview.tag <= 400 && subview.tag != 300) {
                                UIButton *button = (UIButton *) subview;
                                if (button.tag == 138) {
                                    NSLog(@"");
                                }
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[first_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }
                                else{
                                    [json setValue:@"no" forKey:[first_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }
                            }
//                            if ((10==subview.tag)) {
//                                UISegmentedControl *temp = (UISegmentedControl *)subview;
//                                [json setValue:[NSString stringWithFormat:@"%d",(temp.selectedSegmentIndex+1)] forKey:[first_assessment_fields objectAtIndex:9]];
//                                //NSLog(@"%d", temp.selectedSegmentIndex);
//                            }
                        }
                        //Remove here
//                        for (NSString* key in [assessments allKeys]){
//                            [json setValue:[assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 110]];
//                        }
                    }
                    if (2==type) { //Progress Assessment
                        [json setValue:@"Progress Assessment" forKey:@"nameReport"];
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if (subview.tag == 100) { //Sign
                                //Tim cach fix cho nay, Tim chu ky that
                                //                                    [json setValue:@"Sign" forKey:[assessment_fields_info objectAtIndex:5]];
                                [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                            }
                            if ((0!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)){
                                
                                //sub sub view
                                if (subview.tag == 999) {
                                    for (UIView *view in subview.subviews) {
    
                                        for (UIView *subView2 in view.subviews) {
                                            if (subView2.tag > 0 && subView2.tag < 100) {
                                                UITextField *temp = (UITextField *) subView2;
                                                [json setValue:temp.text forKey:[process_assessment_subtextfield objectAtIndex:(subView2.tag %20 - 1)]];
                                         
                                            }
                                            if (subView2.tag >= 550) {
                                                UIButton *button = (UIButton *) subView2;
                                                if (subView2.tag < 555) { //yes
                                                    if (button.selected) {
                                                        [json setValue:@"yes" forKey:[process_assessment_radio objectAtIndex:(subView2.tag%550)]];
                                                    }else{
                                                        [json setValue:@"no" forKey:[process_assessment_radio objectAtIndex:(subView2.tag%550)]];
                                                    }
                                                }else{ //no
                                                    if (button.selected) {
                                                        [json setValue:@"yes" forKey:[process_assessment_radio_no objectAtIndex:(subView2.tag%555)]];
                                                    }else{
                                                        [json setValue:@"no" forKey:[process_assessment_radio_no objectAtIndex:(subView2.tag%555)]];
                                                    }
                                                }
                                                
                                            }
                                        }
                                    }
                                    continue;
                                }
                                //sub sub view
                                if (subview.tag == 998) {
                                    for (UIView *view in subview.subviews) {
                                        for (UIView *subView2 in view.subviews) {
                                            if (subView2.tag > 0) {
                                                int tag = subView2.tag  %36;
                                                int i = tag + 10;
                                                UITextField *temp = (UITextField *) subView2;
                                                [json setValue:temp.text forKey:[process_assessment_subtextfield objectAtIndex:(i)]];
                                            }
                                        }
                                    }
                                    continue;
                                }
                                if ((subview.tag >= 600 && subview.tag < 800) || subview.tag == 100/*sign */) { //info
                                    if (subview.tag == 100) { //Sign
                                        //Tim cach fix cho nay, Tim chu ky that
                                        //[json setValue:@"Sign" forKey:[assessment_fields_info objectAtIndex:5]];
                                        [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"info_drsign"];
                                    }else{
                                        NSInteger index = -1;
                                        NSLog(@"%d",subview.tag);
                                        if (subview.tag == 650) {//Date
                                            index = 6;
                                        }else{
                                            index = subview.tag % 600;
                                        }
                                        UITextField *temp = (UITextField *)subview;
                                        [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:index]];
                                    }
                                    continue;
                                }
                                //textview
                                if (subview.tag >500 && subview.tag < 510) {
                                    UITextView *temp = (UITextView *) subview;
                                    [json setValue:temp.text forKey:[process_assessment_textview objectAtIndex:(temp.tag % 500 - 1)]];
                                    continue;
                                }
                                //checkbox
                                if (subview.tag >=120 && subview.tag <= 400 && subview.tag != 300) {
                                    UIButton *button = (UIButton *) subview;
                                    if (button.selected) {
                                        [json setValue:@"yes" forKey:[process_assessment_checkbox objectAtIndex:(button.tag % 120)]];
                                    }else{
                                        [json setValue:@"no" forKey:[process_assessment_checkbox objectAtIndex:(button.tag % 120)]];
                                    }
                                    continue;
                                }
                                //textfield date and text
                                if (subview.tag >= 1 && subview.tag < 100) {
                                    UITextField *temp = (UITextField *) subview;
                                    if (subview.tag < 20) {
                                        [json setValue:temp.text forKey:[process_assessment_datefield objectAtIndex:(subview.tag - 1)]];
                                    }else{
                                        [json setValue:temp.text forKey:[process_assessment_fields objectAtIndex:(subview.tag %20)]];
                                    }
//                                    if (subview.tag < 20) { //textfield date
//                                        [json setValue:temp.text forKey:[process_assessment_fields objectAtIndex:(subview.tag - 1)]];
//                                    }else{ //textfield text
//                                        [json setValue:temp.text forKey:[process_assessment_fields objectAtIndex:(subview.tag %20 + 8)]];
//                                    }
                                    
                                }
//                                if ((100>subview.tag)) {
//                                    UITextField *temp = (UITextField *)subview;
//                                    [json setValue:temp.text forKey:[progress_assessment_fields objectAtIndex:(temp.tag-1)]];
//                                }
                            }
                        }
                        //Remove here
//                        for (NSString* key in [passessments allKeys]){
//                            [json setValue:[passessments objectForKey:key] forKey:[NSString stringWithFormat:@"p-assessment-%d", [key intValue] - 100]];
//                        }
                    }
                    //Final
                    if (3==type) {
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((subview.tag >= 600 && subview.tag < 800) || subview.tag == 100/*sign */) { //info
                                if (subview.tag == 100) { //Sign
                                    //Tim cach fix cho nay, Tim chu ky that
                                    [json setValue:[currentDoctor.detail objectForKey:@"drsign"] forKey:@"sign_doctor"];
                                    NSLog(@"json %@", json);
                                } else {
                                    NSInteger index = -1;
                                    if (subview.tag == 650) {//Date
                                        index = 6;
                                    }else{
                                        index = subview.tag % 600;
                                    }
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[assessment_fields_info objectAtIndex:index]];
                                }
                                continue;
                            }
                            
                            if (subview.tag > 500 && subview.tag < 510) { //textview
                                UITextView *temp = (UITextView *) subview;
                                [json setValue:temp.text forKey:[final_assessment_textview objectAtIndex:(subview.tag%500 - 1)]];
                                continue;
                            }
                            if (/*(0!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(900!=subview.tag)*/subview.tag >= 1 && subview.tag < 100){
                                UITextField *temp = (UITextField *) subview;
                                if (subview.tag < 20) { //textfield date
                                    [json setValue:temp.text forKey:[final_assessment_fields objectAtIndex:(subview.tag - 1)]];
                                }else{ //textfield text
                                    [json setValue:temp.text forKey:[final_assessment_fields objectAtIndex:(subview.tag %20 + 3)]];
                                }
                                
                            }
                            //checkbox
                            if (subview.tag >= 120 && subview.tag <= 400 && subview.tag != 300) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[final_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }else{
                                    [json setValue:@"no" forKey:[final_assessment_checkbox objectAtIndex:(button.tag%120)]];
                                }
                            }
                        }
                        //Remove here
//                        for (NSString* key in [fassessments allKeys]){
//                            [json setValue:[fassessments objectForKey:key] forKey:[NSString stringWithFormat:@"f-assessment-%d", [key intValue] - 100]];
//                            
//                        }
                    }
                    break;
                case 5: // VIC insertDB
                    if (2==type) { //Progress Assessment VIC.
                        [json setValue:@"Progress Assessment" forKey:@"nameReport"];
                    }
                    for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                        //NSLog(@"%d", subview.tag);
                        if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(11!=subview.tag)){
//                            info doctor and worker declares
                            if (subview.tag >= 3 && subview.tag <= 6) {
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[vic_assessment_fields objectAtIndex:(temp.tag - 3)]];
                            }
                            if (subview.tag >= 37 && subview.tag <= 40) {
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[vic_assessment_fields objectAtIndex:(temp.tag - 33)]];
                            }
                            
                            //                            text field
                            if (subview.tag >= 20 && subview.tag <= 28) {
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[vic_assessment_textfields objectAtIndex:(subview.tag - 20)]];
                            }
                            //                            checkbox
                            if (subview.tag >= 111 && subview.tag <= 115) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[vic_assessment_checkbox objectAtIndex:(button.tag - 111)]];
                                }else{
                                    [json setValue:@"no" forKey:[vic_assessment_checkbox objectAtIndex:(button.tag - 111)]];
                                }
                            }
                            //                            radio button
                            if (subview.tag >= 551 && subview.tag <= 586) {
                                UIButton *radioButton = (UIButton *) subview;
                                if (subview.tag >= 551 && subview.tag <= 556) {
                                    if(radioButton.selected) {
                                        int i = (radioButton.tag - 551) / 2;
                                        [json setValue:radioButton.titleLabel.text forKey:[vic_assessment_radio objectAtIndex:(i + 9)]];
                                    }
                                } else {
                                    if (radioButton.selected) {
                                        int x = (subview.tag - 560) / 3;
                                        [json setValue:radioButton.titleLabel.text forKey:[vic_assessment_radio objectAtIndex:(x)]];
                                    }
                                }
                            }
                            if(subview.tag == 557) {
                                UIButton *radioButton = (UIButton *) subview;
                                if (radioButton.selected) {
                                    [json setValue:@"yes" forKey:[vic_assessment_radio objectAtIndex:(12)]];
                                } else {
                                    [json setValue:@"no" forKey:[vic_assessment_radio objectAtIndex:(12)]];
                                }
                            }
                            if(subview.tag == 558) {
                                UIButton *radioButton = (UIButton *) subview;
                                if (radioButton.selected) {
                                    [json setValue:@"yes" forKey:[vic_assessment_radio objectAtIndex:(13)]];
                                } else {
                                    [json setValue:@"no" forKey:[vic_assessment_radio objectAtIndex:(13)]];
                                }
                            }
//                                                        text view
                            NSLog(@"%ld", (long)subview.tag);
                            if (subview.tag >= 29 && subview.tag <= 36) {
                                UITextView *temp = (UITextView *) subview;
                                [json setValue:temp.text forKey:[vic_assessment_textviews objectAtIndex:(temp.tag - 29)]];
                            }
                        }
                    }
                    for (NSString* key in [vic_assessments allKeys]){
                        [json setValue:[vic_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"checkbox-%d", [key intValue] - 110]];
                    }
                    break;
                case 4: // TAS
                    if (1==type) {
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(10!=subview.tag)&&(30!=subview.tag)){
                                if ((100>subview.tag)) {
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[tas_first_assessment_fields objectAtIndex:(temp.tag-1)]];
                                    //NSLog(@"%@-%d-%@", temp.text, temp.tag, [first_assessment_fields objectAtIndex:(temp.tag-1)]);
                                }
                            }
                            if ((10==subview.tag)||(30==subview.tag)) {
                                UISegmentedControl *temp = (UISegmentedControl *)subview;
                                [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[tas_first_assessment_fields objectAtIndex:(temp.tag-1)]];
                                //NSLog(@"%d", temp.selectedSegmentIndex);
                            }
                        }
                        for (NSString* key in [tas_assessments allKeys]){
                            [json setValue:[tas_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 110]];
                        }
                    } else {
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(11!=subview.tag)&&(22!=subview.tag)&&(23!=subview.tag)&&(24!=subview.tag)&&(38!=subview.tag)&&(53!=subview.tag)&&(55!=subview.tag)&&((41>subview.tag)||(51<subview.tag))){
                                if ((100>subview.tag)) {
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[tas_final_assessment_fields objectAtIndex:(temp.tag-1)]];
                                    //NSLog(@"%@-%d-%@", temp.text, temp.tag, [first_assessment_fields objectAtIndex:(temp.tag-1)]);
                                }
                            }
                            
                            if ((11==subview.tag)||(22==subview.tag)||(23==subview.tag)||(24==subview.tag)||(38==subview.tag)||(53==subview.tag)||(55==subview.tag)||((40<subview.tag)&&(52>subview.tag))) {
                                UISegmentedControl *temp = (UISegmentedControl *)subview;
                                [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[tas_final_assessment_fields objectAtIndex:(temp.tag-1)]];
                                //NSLog(@"%d", temp.selectedSegmentIndex);
                            }
                        }
                        for (NSString* key in [tas_assessments allKeys]){
                            [json setValue:[tas_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 100]];
                        }
                    }
                    break;
                case 2: // QLD
                    for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                        //NSLog(@"%d", subview.tag);
                        if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(10!=subview.tag)&&((35<subview.tag)||(29>subview.tag))){
                            if ((100>subview.tag)) {
                                //NSLog(@"%d-%d", subview.tag,(subview.tag-1));
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[qld_assessment_fields objectAtIndex:(temp.tag-1)]];
                            }
                        }
                        if ((10==subview.tag)||((28<subview.tag)&&(36>subview.tag))) {
                            UISegmentedControl *temp = (UISegmentedControl *)subview;
                            [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[qld_assessment_fields objectAtIndex:(subview.tag-1)]];
                            //NSLog(@"%d", temp.selectedSegmentIndex);
                        }
                    }
                    for (NSString* key in [qld_assessments allKeys]){
                        [json setValue:[qld_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"checkbox-%d", [key intValue] - 110]];
                    }
                    break;
                case 1: // NT insertDB
                    if (1==type) {
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(21!=subview.tag)&&(24!=subview.tag)&&(39!=subview.tag)){
                                if ((100>subview.tag)) {
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[nt_first_assessment_fields objectAtIndex:(temp.tag-1)]];
                                    //NSLog(@"%@-%d-%@", temp.text, temp.tag, [first_assessment_fields objectAtIndex:(temp.tag-1)]);
                                }
                            }
                            if ((21==subview.tag)||(39==subview.tag)||(24==subview.tag)) {
                                UISegmentedControl *temp = (UISegmentedControl *)subview;
                                [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[nt_first_assessment_fields objectAtIndex:(temp.tag-1)]];
                                //NSLog(@"%d", temp.selectedSegmentIndex);
                            }
                            if (subview.tag == 136) {
                                UISegmentedControl *temp = (UISegmentedControl *)subview;
                                [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex)] forKey:[nt_first_assessment_fields objectAtIndex:43]];
                            }
                            if (subview.tag == 118) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[nt_first_assessment_checkbox objectAtIndex:(0)]];
                                } else {
                                    [json setValue:@"no" forKey:[nt_first_assessment_checkbox objectAtIndex:(0)]];
                                }
                            }
                            if (subview.tag == 125) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[nt_first_assessment_checkbox objectAtIndex:(1)]];
                                } else {
                                    [json setValue:@"no" forKey:[nt_first_assessment_checkbox objectAtIndex:(1)]];
                                }
                            }
                        }
                        for (NSString* key in [nt_assessments allKeys]){
                            [json setValue:[nt_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 110]];
                        }
                    }
                    if (2==type) {
                        [json setValue:@"Progress Assessment" forKey:@"nameReport"];
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)&&(16!=subview.tag)){
                                if ((100>subview.tag && subview.tag != 33 && subview.tag != 31 && subview.tag != 32)) {
                                    if (subview.tag >= 36 && subview.tag <= 41) {
                                        UITextField *temp = (UITextField *)subview;
                                        [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(temp.tag - 1)]];
                                    } else {
                                        if (subview.tag == 11) {
                                            UITextField *temp = (UITextField *)subview;
                                            [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(42)]];
                                        } else if (subview.tag == 21) {
                                            UITextField *temp = (UITextField *)subview;
                                            [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(43)]];
                                        } else if (subview.tag == 22) {
                                            UITextField *temp = (UITextField *)subview;
                                            [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(44)]];
                                        } else {
                                            UITextField *temp = (UITextField *)subview;
                                            [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(temp.tag-1)]];
                                        }
                                    }
                                }
//                                vocationalpreferdays
                                if (subview.tag == 31) {
                                    UISegmentedControl *temp = (UISegmentedControl *)subview;
                                    [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex)]
                                            forKey:[nt_progress_assessment_fields objectAtIndex:32]];
                                }
//                                vocationalprefertime
                                if (subview.tag == 32) {
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[nt_progress_assessment_fields objectAtIndex:(41)]];
                                }
//                                medicalprecday
                                if (subview.tag == 136) {
                                   UISegmentedControl *temp = (UISegmentedControl *)subview;
                                   [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex)]
                                            forKey:[nt_progress_assessment_fields objectAtIndex:33]];
                                }
                            }
                            if ((16==subview.tag)) {
                                UISegmentedControl *temp = (UISegmentedControl *)subview;
                                [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[nt_first_assessment_fields objectAtIndex:(temp.tag-1)]];
                                //NSLog(@"%d", temp.selectedSegmentIndex);
                            }
                        }
                        for (NSString* key in [nt_assessments allKeys]){
                            [json setValue:[nt_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 100]];
                        }
                    }
                    if (3==type) {
                        for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                            if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(900!=subview.tag)&&(800!=subview.tag)){
                                if ((100>subview.tag)) {
                                    UITextField *temp = (UITextField *)subview;
                                    [json setValue:temp.text forKey:[nt_final_assessment_fields objectAtIndex:(temp.tag-1)]];
                                    //NSLog(@"%@-%d-%@", temp.text, temp.tag, [first_assessment_fields objectAtIndex:(temp.tag-1)]);
                                }
                            }
                            if (subview.tag >= 111 && subview.tag <= 113) {
                                UIButton *button = (UIButton *) subview;
                                if (button.selected) {
                                    [json setValue:@"yes" forKey:[nt_final_assessment_checkbox objectAtIndex:(button.tag - 111)]];
                                } else {
                                    [json setValue:@"no" forKey:[nt_final_assessment_checkbox objectAtIndex:(button.tag - 111)]];
                                }
                            }
                        }
                        for (NSString* key in [nt_assessments allKeys]){
                            [json setValue:[nt_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"assessment-%d", [key intValue] - 100]];
                        }
                    }
                    break;
                case 0: // NSW
                    for (UIView *subview in [[edetail viewWithTag:maxIndex] subviews]) {
                        //NSLog(@"%d", subview.tag);
                        if ((0!=subview.tag)&&(1!=subview.tag)&&(6!=subview.tag)&&(900!=subview.tag)&&(999!=subview.tag)&&(300!=subview.tag)&&(800!=subview.tag)&&(10!=subview.tag)&&(15!=subview.tag)&&(24!=subview.tag)){
                            if ((100>subview.tag)) {
                                
                                UITextField *temp = (UITextField *)subview;
                                [json setValue:temp.text forKey:[nsw_assessment_fields objectAtIndex:(temp.tag-1)]];
                            }
                        }
                        if ((10==subview.tag)||(15==subview.tag)||(24==subview.tag)) {
                            UISegmentedControl *temp = (UISegmentedControl *)subview;
                            [json setValue:[NSString stringWithFormat:@"%ld",(temp.selectedSegmentIndex+1)] forKey:[nsw_assessment_fields objectAtIndex:(subview.tag-1)]];
                            //NSLog(@"%d", temp.selectedSegmentIndex);
                        }
                    }
                    for (NSString* key in [nsw_assessments allKeys]){
                        [json setValue:[nsw_assessments objectForKey:key] forKey:[NSString stringWithFormat:@"checkbox-%d", [key intValue] - 110]];
                    }
                    break;
                default:
                    break;
            }
        }
    }
    [json setValue:[NSString stringWithFormat:@"%d",state] forKey:[NSString stringWithFormat:@"state-%d",type]];
    
    SBJsonWriter *jsonWriter = [[SBJsonWriter alloc] init];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    [json setValue:[defaults valueForKey:@"memId"] forKey:@"drId"];
    //NSLog(@"%@", json);
    NSString *post = nil;
    if ([[entry.detail objectForKey:@"itype"] isEqualToString:@"1"]){
        [json setValue:@"TRUE" forKey:@"general"];
        if ([entry.status isEqualToString:@"1"]){
//            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid];
            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&hasProgress=1&progressdata=%@",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
            //NSLog(@"%@ - %@", entry.eid, post);
        }else{
            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&progressdata=%@&hasProgress=2",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
        }
    }else{
        [json setValue:@"FALSE" forKey:@"general"];
        if (1==type){
            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&hasProgress=1&progressdata=%@",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
            //NSLog(@"%@", entry.eid);
        }
        if (2==type){
            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&progressdata=%@&hasProgress=2",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
        }
        if (3==type){
            post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&progressdata=%@&hasProgress=3",(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,(__bridge_transfer NSString *)CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
            //NSLog(@"here");
        }
        if (4==type){
            [json setValue:@"TRUE" forKey:@"general"];
            
            if ([entry.status isEqualToString:@"1"]){
                post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess",CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid];
            }else{
                post = [NSString stringWithFormat:@"data=%@&id=%@&type=assess&progressdata=%@&hasProgress=2",CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8),entry.eid,CFURLCreateStringByAddingPercentEscapes(NULL,(CFStringRef)[jsonWriter stringWithObject:json],NULL,(CFStringRef)@"!*'();:@&=+$,/?%#[]",kCFStringEncodingUTF8)];
            }
        }
    }
    //NSLog(@"%@",post);
    
    post = [NSString stringWithFormat:@"%@&script=%@&pbs=%@&rpbs=%@&other=%@",post,[defaults valueForKey:@"script"],[defaults valueForKey:@"PBS"],[defaults valueForKey:@"RPBS"],[defaults valueForKey:@"Other"]];
    
//    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json/submit" postData:post showAlert:YES];

    NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/submit/?token=%@",[defaults objectForKey:@"tokenUser"]] postData:post showAlert:NO];
    //NSString *retval = [rteleWebserviceManager sendPOSTSynchronousWebserviceRequest:@"json2/submit" postData:post showAlert:YES];
    if ([retval isEqualToString:@"0"]){ //Failed
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your network has some problem.\nPlease check it and submit it again." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert setTag:10];
        [alert show];
//        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
//        [delegate hideActivityViewer];
    }else{
        if ([retval integerValue] > 0) {
            [[NSUserDefaults standardUserDefaults] setValue:@"1" forKey:@"loadagain"];
            NSURL *URL = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@/1?token=%@", entry.eid, [NSString stringWithFormat:@"%d",type],retval,[defaults objectForKey:@"companyId"],[defaults valueForKey:@"tokenUser"]] relativeToURL:[rteleWebserviceManager getURL]];
            
            NSLog(@"\n URL Request: %@",URL);
            //URL Requst Object
//            NSURLRequest *requestObj = [NSURLRequest requestWithURL:URL];
//            NSLog(@"\nREquest: %@",requestObj);
            UIWebView *webView = [[UIWebView alloc] initWithFrame:self.view.bounds];
            NSMutableURLRequest *requestA = [NSMutableURLRequest requestWithURL:URL cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
            NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
            [requestA setValue:author_token forHTTPHeaderField:@"Authorization"];
            [webView loadRequest:requestA];
            [webView setDelegate:self];
            [webView setHidden:YES];
            [self.view addSubview:webView];
        } else {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Error!" message:@"Your network has some problem.\nPlease check it and submit it again." delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
            [alert setTag:10];
            [alert show];
            
//            rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
//            [delegate hideActivityViewer];
        }
    }
}
-(void)webViewDidFinishLoad:(UIWebView *)webView{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    [[[UIAlertView alloc] initWithTitle:@"Successful" message:@"" delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil] show];
}

#pragma mark - UIAlertViewDelegate
-(void)alertView:(UIAlertView *)alertView clickedButtonAtIndex:(NSInteger)buttonIndex{
    if (alertView.tag == 10) {
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
    }else
    {
        [self.navigationController popViewControllerAnimated:YES];
    }
    
    UIView *backgroundView = [self.view viewWithTag:9999];
    [backgroundView removeFromSuperview];
}
-(IBAction)chooseDate:(id)sender{
    UIDatePicker *picker = (UIDatePicker *) sender;
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"dd/MM/yyyy"];
    activeField.text = [format stringFromDate:picker.date];
}
-(IBAction)chooseTime:(id)sender{
    UIDatePicker *picker = (UIDatePicker *) sender;
    NSDateFormatter * format = [[NSDateFormatter alloc] init];
    [format setDateFormat:@"HH:mm"];
    activeField.text = [format stringFromDate:picker.date];
}
-(void) setValueForButtons:(UIButton *) button index:(NSInteger) _index dict:(NSMutableDictionary *) dict{
    if (_index == 0) {
        UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
        [secondButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",secondButton.tag]];
        UIButton *thirdButton = (UIButton *) [button.superview viewWithTag:(button.tag + 2)];
        [thirdButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",thirdButton.tag]];
    }
    if (_index == 1) {
        UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag -1)];
        [firstButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",firstButton.tag]];
        
        UIButton *thirdButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
        [thirdButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",thirdButton.tag]];
    }
    if (_index == 2) {
        UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
        [firstButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",firstButton.tag]];
        
        UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag -1)];
        [secondButton setSelected:NO];
        [dict setValue:@"off" forKey:[NSString stringWithFormat:@"%d",secondButton.tag]];
    }
}
-(void) radioButtonTouchDown:(UIButton *) button{
    [activeField resignFirstResponder];
    [self.activeView resignFirstResponder];
    NSInteger index = (button.tag - 550) %3;
    switch (state) {
        case 3:{//SA
            [button setSelected:YES];
            
            if (button.tag == 551) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 552){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            if (button.tag == 553) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 554){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            if (button.tag == 555) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 5)];
                [firstButton setSelected:NO];
            }else if (button.tag == 550){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 5)];
                [firstButton setSelected:NO];
            }
            if (button.tag == 560) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 561){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 562){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            if (button.tag == 563) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 564){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 565){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 566) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 567){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 568){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 569) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 570){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 571){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 572) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 573){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 574){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 575) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 576){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 577){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 578) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 579){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 580){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 581) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 582){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 583){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 584) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 585){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 586){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 587) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 588){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 589){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 590) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 591){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 592){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 593) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 594){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 595){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 596) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 597){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 598){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
        }
            break;
        case 6: //WA
            if (1==type){
                [button setSelected:YES];
                [assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                [self setValueForButtons:button index:index dict:assessments];
//                if ([[assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]|| ![assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]]){
//                    [button setSelected:YES];
//                    [assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
//                    [self setValueForButtons:button index:index dict:assessments];
//                }
            }
            if (2==type){
                [button setSelected:YES];
                [passessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                if (button.tag < 555) {
                    UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 5)];
                    [firstButton setSelected:NO];
                }else{
                    UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 5)];
                    [firstButton setSelected:NO];
                }
//                if ([[passessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]|| ![passessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]]){
//                    [button setSelected:YES];
//                    [passessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
//                    if (button.tag < 555) {
//                        UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 5)];
//                        [firstButton setSelected:NO];
//                    }else{
//                        UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 5)];
//                        [firstButton setSelected:NO];
//                    }
//                    
//                    [self setValueForButtons:button index:index dict:passessments];
//                }
            }
            if (3==type){
                [button setSelected:YES];
                [fassessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
                [self setValueForButtons:button index:index dict:fassessments];
//                if ([[fassessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]|| ![fassessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] ){
//                    [button setSelected:YES];
//                    [fassessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
//                    
//                    [self setValueForButtons:button index:index dict:fassessments];
//                }
            }
            break;
        case 5: //VIC
        {
            [button setSelected:YES];
            if (button.tag == 560) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 561){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 562){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            if (button.tag == 563) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 564){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 565){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 566) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 567){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 568){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 569) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 570){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 571){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 572) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 573){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 574){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 575) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 576){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 577){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 578) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 579){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 580){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 581) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 582){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 583){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 584) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag + 2)];
                [secondButton setSelected:NO];
            }else if (button.tag == 585){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [secondButton setSelected:NO];
            }
            else if (button.tag == 586){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
                UIButton *secondButton = (UIButton *)[button.superview viewWithTag:(button.tag - 2)];
                [secondButton setSelected:NO];
            }
            
            if (button.tag == 551) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 552){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            
            if (button.tag == 553) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 554){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            
            if (button.tag == 555) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 556){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            
            if (button.tag == 557) {
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag + 1)];
                [firstButton setSelected:NO];
            }else if(button.tag == 558){
                UIButton *firstButton = (UIButton *)[button.superview viewWithTag:(button.tag - 1)];
                [firstButton setSelected:NO];
            }
            
            
            break;
        }
        case 4: //TAS
        {
            if ([[tas_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"] || ![tas_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]]){
                [button setSelected:YES];
                [tas_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
                [self setValueForButtons:button index:index dict:tas_assessments];
            }
            break;
        }
        case 2: //QLD
        {
            if ([[qld_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"] || ![qld_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]]){
                [button setSelected:YES];
                [qld_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
                [self setValueForButtons:button index:index dict:qld_assessments];
            }
            break;
        }
        case 1://NT
        {
            if ([[nt_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"] || ![nt_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]]){
                [button setSelected:YES];
                [nt_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
                [self setValueForButtons:button index:index dict:nt_assessments];
            }
            break;
        }
        case 0: //NSW
        {
            if ([[nsw_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"] || ![nsw_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]]){
                [button setSelected:YES];
                [nsw_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
                [self setValueForButtons:button index:index dict:nsw_assessments];
            }
            break;
        }
        default: //SA
        {
            
        }
            break;
    }
}

-(IBAction)toggleCheckboxes:(id)sender{
    UIButton *button = sender;
    [activeField resignFirstResponder];
    switch (state) {
        case 3:{//SA
            button.selected = !button.selected;
            //            if (button.tag == 120) {
            //                if (button.selected) {
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:2];
            //                    [textField setEnabled:YES];
            //                }else{
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:2];
            //                    [textField setEnabled:NO];
            //                }
            //            }
            //
            //            if (button.tag == 121) {
            //                if (button.selected) {
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:3];
            //                    [textField setEnabled:YES];
            //                    textField = (UITextField *)[button.superview viewWithTag:4];
            //                    [textField setEnabled:YES];
            //                }else{
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:3];
            //                    [textField setEnabled:NO];
            //                    textField = (UITextField *)[button.superview viewWithTag:4];
            //                    [textField setEnabled:NO];
            //
            //                }
            //            }
            //
            //            if (button.tag == 122) {
            //                if (button.selected) {
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:5];
            //                    [textField setEnabled:YES];
            //                    textField = (UITextField *)[button.superview viewWithTag:6];
            //                    [textField setEnabled:YES];
            //                }else{
            //                    UITextField *textField = (UITextField *)[button.superview viewWithTag:5];
            //                    [textField setEnabled:NO];
            //                    textField = (UITextField *)[button.superview viewWithTag:6];
            //                    [textField setEnabled:NO];
            //
            //                }
            //            }
        }
            break;
        case 6:
            if (1==type){
                if ([[assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
                    [button setSelected:YES];
                    [assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                    
                }else{
                    [button setSelected:NO];
                    [assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                }
            }
            if (2==type){
                if ([[passessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
                    [button setSelected:YES];
                    [passessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                    
                }else{
                    [button setSelected:NO];
                    [passessments setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                }
            }
            if (3==type){
                if ([[fassessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
                    [button setSelected:YES];
                    [fassessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                    
                }else{
                    [button setSelected:NO];
                    [fassessments setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                }
            }
            if (4==type){
                if ([[assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
                    [button setSelected:YES];
                    [assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                    
                }else{
                    [button setSelected:NO];
                    [assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                }        }
            break;
        case 5:
        {
            if ([[vic_assessments valueForKey:[NSString stringWithFormat:@"%ld",(long)button.tag]] isEqualToString:@"off"]){
                [button setSelected:YES];
                [vic_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%ld",(long)button.tag]];
                
            }else{
                [button setSelected:NO];
                [vic_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",button.tag]];
            }
            break;
        }
        case 4:
        {
            if ([[tas_assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]){
                [button setSelected:YES];
                [tas_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
                
            }else{
                [button setSelected:NO];
                [tas_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",button.tag]];
            }
            break;
        }
        case 2:
        {
            if ([[qld_assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]){
                [button setSelected:YES];
                [qld_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
                
            }else{
                [button setSelected:NO];
                [qld_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",button.tag]];
            }
            break;
        }
        case 1:
        {
            if ([[nt_assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]){
                [button setSelected:YES];
                [nt_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
                
            }else{
                [button setSelected:NO];
                [nt_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",button.tag]];
            }
            break;
        }
        case 0:
        {
            if ([[nsw_assessments valueForKey:[NSString stringWithFormat:@"%d",button.tag]] isEqualToString:@"off"]){
                [button setSelected:YES];
                [nsw_assessments setValue:@"on" forKey:[NSString stringWithFormat:@"%d",button.tag]];
                
            }else{
                [button setSelected:NO];
                [nsw_assessments setValue:@"off" forKey:[NSString stringWithFormat:@"%d",button.tag]];
            }
            break;
        }
        default:
            break;
    }
    
    
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
        edetail.contentSize = CGSizeMake(SCROLLVIEW_CONTENT_WIDTH,
                                         SCROLLVIEW_CONTENT_HEIGHT);
    }else{
        NSLog(@"%@",NSStringFromCGRect(self.view.bounds));
        [edetail setFrame:CGRectMake(0, 0, self.view.frame.size.height, self.view.frame.size.width)];
        edetail.contentSize = CGSizeMake(self.view.frame.size.height,
                                         self.view.frame.size.width * 2);
    }
    
    
    //Initially the keyboard is hidden
    keyboardVisible = NO;
    
}

-(void) viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];
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
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        // Keyboard is now visible
        keyboardVisible = YES;
    }
    
}
-(void) keyboardDidHide: (NSNotification *)notif {
    // Is the keyboard already shown
    if (!keyboardVisible) {
        //NSLog(@"Keyboard is already hidden. Ignore notification.");
        return;
    }
    
    //[edetail setContentOffset:CGPointMake(0, 0) animated:YES];
    datepick.hidden = true;
    timepick.hidden = true;
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
    [activeField resignFirstResponder];
    activeField = textField;
    //How to resolve this problem (solved)
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        if (activeField.superview.superview.tag == 999 || activeField.superview.superview.tag == 998) {
            //        CGFloat y = [[activeField superview] superview].frame.origin.y + activeField.superview.frame.origin.y + activeField.frame.origin.y + 200;
            CGFloat y = activeField.frame.origin.y + activeField.superview.frame.origin.y + activeField.superview.superview.frame.origin.y + activeField.superview.superview.superview.frame.origin.y;
            if (208<(y+activeField.frame.origin.y)){
                [edetail setContentOffset:CGPointMake(0, (y+activeField.frame.origin.y - (768-352)/2)) animated:YES];
            }else{
                [edetail setContentOffset:CGPointMake(0,0) animated:YES];
                
            }
            
            return YES;
        }
        CGFloat y = [activeField superview].frame.origin.y;
        if (208<(y+activeField.frame.origin.y)){
            [edetail setContentOffset:CGPointMake(0, (y+activeField.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [edetail setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
    }else{
        [UIView animateWithDuration:0.2 animations:^{
            CGPoint point = [self.view convertPoint:textField.frame.origin fromView:textField.superview];
            [edetail setContentOffset:CGPointMake(0, point.y - 50)];
        }];
        
    }
    
    datepick.hidden = FALSE;
    timepick.hidden = FALSE;
    
    //NSLog(@"%f",(activeField.frame.origin.y));
    [datepick removeFromSuperview];
    [timepick removeFromSuperview];
//    if (textField.inputView != datepick && textField.inputView != timepick) {
//        isFirst = FALSE;
//        return YES;
//    }
//    if (!isFirst) {
//        isFirst = TRUE;
//        return YES;
//    }
//    [datepick setHidden:YES];
//    [timepick setHidden:YES];
//    [textField resignFirstResponder];
//    isFirst = FALSE;
    if ([textField.inputView isEqual:datepick] && [textField.text isEqualToString:@""]) {
        NSDate *date = [[NSDate alloc] init];
        NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
        [dateFormatter setDateFormat:@"dd/MM/yyyy"];
        NSString *datestr = [dateFormatter stringFromDate:date];
        [textField setText:datestr];
    }
    return YES;
    
}
- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    [textField resignFirstResponder];
    return YES;
}

#pragma mark UITextViewDelegate
-(BOOL)textViewShouldBeginEditing:(UITextView *)textView{
    self.activeView = textView;
    if (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad) {
        CGFloat y = [self.activeView superview].frame.origin.y;
        if (208<(y+self.activeView.frame.origin.y)){
            [edetail setContentOffset:CGPointMake(0, (y+self.activeView.frame.origin.y - (768-352)/2)) animated:YES];
        }else{
            [edetail setContentOffset:CGPointMake(0,0) animated:YES];
            
        }
    }else{
        [UIView animateWithDuration:0.2 animations:^{
            CGPoint point = [self.view convertPoint:textView.frame.origin fromView:textView.superview];
            [edetail setContentOffset:CGPointMake(0, point.y - 50)];
        }];
        
    }
    
    
    datepick.hidden = FALSE;
    timepick.hidden = FALSE;
    
    return YES;
}

-(void)populateData:(rteleEntry*)eentry forEmployee:(rteleEmployee*)eemployee{
    activebtn = nil;
    
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
-(IBAction)toggle:(id)sender{
    UIButton *button = (UIButton *)sender;
    NSString *val = [buttons objectForKey:[NSString stringWithFormat:@"%d",button.tag]];
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
    }
    
    [UIView commitAnimations];
    
    
    //NSLog(@"%@ - %@", [active objectForKey:val], val);
}

-(void)movePanelsFrom:(NSInteger)index up:(BOOL)direction{
    NSInteger offset;
    if (direction){
        offset = 35-[[panelHeight objectForKey:[NSString stringWithFormat:@"%d",index]] floatValue];
    }else{
        offset = -35+[[panelHeight objectForKey:[NSString stringWithFormat:@"%d",index]] floatValue];
    }
    UIView *myView;
    CGFloat sum =0;
    //NSLog(@"%d",offset);
    for(int i=index+1; i<=maxIndex;i++){
        myView = [edetail viewWithTag:i];
        [UIView beginAnimations:nil context:nil];
        [UIView setAnimationDuration:0.3];
        CGRect rect = CGRectMake(myView.frame.origin.x,myView.frame.origin.y+offset,myView.frame.size.width ,myView.frame.size.height);
        myView.frame = rect;
        sum = sum + myView.frame.origin.y+myView.frame.size.height;
        [UIView commitAnimations];
    }
    if (index==maxIndex){
        edetail.contentSize = CGSizeMake(0, [edetail viewWithTag:index].frame.origin.y+50 + ([edetail viewWithTag:index].frame.size.height));
    }else{
        edetail.contentSize = CGSizeMake(0, myView.frame.origin.y+myView.frame.size.height+50);
    }
    //NSLog(@"%d, %f -%f - %f", index, myView.frame.origin.y+myView.frame.size.height+50, myView.frame.origin.y+myView.frame.size.height+50, ([edetail viewWithTag:index].frame.size.height));
}

-(void)setStyle{
    for (UIView *subview in [edetail subviews]) {
        if ((0!=subview.tag)&&(111!=subview.tag)){
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


-(BOOL)textView:(UITextView *)textView shouldChangeTextInRange:(NSRange)range replacementText:(NSString *)text{
    if ([text isEqualToString:@"\n"]) {
        [textView resignFirstResponder];
        return FALSE;
    }
    return YES;
}

@end
