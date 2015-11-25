//
//  rteleCertsFunctionViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 25/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleCertViewController.h"
#import "rteleCertsFunctionViewController.h"
#import "rteleEntries.h"
#import "rteleEmployees.h"
#import "rteleEntry.h"
#import "rteleAppDelegate.h"
#import "constants.h"
#import "rteleEmployers.h"
#import "rteleReport.h"

@interface rteleCertsFunctionViewController ()<UIAlertViewDelegate>

@end

@implementation rteleCertsFunctionViewController
@synthesize reports;
@synthesize entry;
@synthesize employee;
@synthesize employeeId;
@synthesize edetail;
@synthesize reportTypes;
@synthesize documents;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
	if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
    //edetail.contentOffset = CGPointMake(10,10);
    reportTypes = [[NSMutableDictionary alloc] init];
    self.navigationItem.backBarButtonItem = [[UIBarButtonItem alloc]
                                               initWithTitle:@"Back" style:UIBarButtonItemStyleBordered target:nil action:nil];
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
    [(UILabel*)[edetail viewWithTag:111] setText:[NSString stringWithFormat:@"%@ %@",[entry.detail objectForKey:@"gname"],[entry.detail objectForKey:@"fname"]]];
    int k=0;
//    if ([entry.status isEqualToString:@"2"]) {
//        k= k+1;
//        CGRect labelFrame = CGRectMake( 20, 40*k, 500, 30 );
//        UILabel* label = [[UILabel alloc] initWithFrame: labelFrame];
//        [label setText: [NSString stringWithFormat:@"First assessment"]];
//        [label setTextColor: [UIColor darkGrayColor]];
//        [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
//        [label setBackgroundColor:[edetail backgroundColor]];
//        [edetail addSubview:label];
//        CGRect buttonFrame = CGRectMake( 330, 40*k-5, 35, 35 );
//        UIButton *button = [[UIButton alloc] initWithFrame: buttonFrame];
//        [button setBackgroundImage:[UIImage imageNamed:@"search_magnifier.png"] forState:UIControlStateNormal];
//        [edetail addSubview: button];
//        [button setTag:1000+k];
//        [button addTarget:nil action:@selector(viewCert:) forControlEvents:UIControlEventTouchDown];
//        [reportTypes setValue:@"1" forKey:[NSString stringWithFormat:@"%d",1000+k]];
//        [reportTypes setValue:@"0" forKey:[NSString stringWithFormat:@"%d",2000+k]];
//        labelFrame = CGRectMake( 370, 40*k, 50, 30 );
//        label = [[UILabel alloc] initWithFrame: labelFrame];
//        [label setText: @"View"];
//        [label setTextColor: [UIColor darkGrayColor]];
//        [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
//        [label setBackgroundColor:[edetail backgroundColor]];
//        [edetail addSubview:label];
//        // email cert
//        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
//        if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
//            
//        }else{
//            buttonFrame = CGRectMake( 430, 40*k-5, 35, 35 );
//            button = [[UIButton alloc] initWithFrame: buttonFrame];
//            [button setBackgroundImage:[UIImage imageNamed:@"email_send.png"] forState:UIControlStateNormal];
//            [edetail addSubview: button];
//            [button setTag:2000+k];
//            [button addTarget:nil action:@selector(emailCert:) forControlEvents:UIControlEventTouchDown];
//            
//            labelFrame = CGRectMake( 470, 40*k, 50, 30 );
//            label = [[UILabel alloc] initWithFrame: labelFrame];
//            [label setText: @"Email"];
//            [label setTextColor: [UIColor darkGrayColor]];
//            [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
//            [label setBackgroundColor:[edetail backgroundColor]];
//            [edetail addSubview:label];
//        }
//
//    }
    k = 0;
    for (rteleReport* report in reports){
        NSString *title;
        k = k +1;
        if ([report.type isEqualToString:@"2"])
            title = [NSString stringWithFormat:@"Progress assessment - %@",report.updatedTime];
        else
            if ([report.type isEqualToString:@"1"]) {
                title = [NSString stringWithFormat:@"First assessment - %@",report.updatedTime];
            }else{
                title = [NSString stringWithFormat:@"Final assessment - %@",report.updatedTime];
            }
        
        CGRect labelFrame = CGRectMake( 20, 40*k, 500, 30 );
        UILabel* label = [[UILabel alloc] initWithFrame: labelFrame];
        [label setText: title];
        [label setTextColor: [UIColor darkGrayColor]];
        [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
        [label setBackgroundColor:[edetail backgroundColor]];
        [edetail addSubview:label];
        CGRect buttonFrame = CGRectMake( 330, 40*k-5, 35, 35 );
        UIButton *button = [[UIButton alloc] initWithFrame: buttonFrame];
        [button setBackgroundImage:[UIImage imageNamed:@"search_magnifier.png"] forState:UIControlStateNormal];
        [edetail addSubview: button];
        [button setTag:1000+k];
        [button addTarget:nil action:@selector(viewCert:) forControlEvents:UIControlEventTouchDown];
        [reportTypes setValue:report.type forKey:[NSString stringWithFormat:@"%d",1000+k]];
        [reportTypes setValue:report.rid forKey:[NSString stringWithFormat:@"%d",2000+k]];
        labelFrame = CGRectMake( 370, 40*k, 50, 30 );
        label = [[UILabel alloc] initWithFrame: labelFrame];
        [label setText: @"View"];
        [label setTextColor: [UIColor darkGrayColor]];
        [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
        [label setBackgroundColor:[edetail backgroundColor]];
        [edetail addSubview:label];
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
            
        }else{
            buttonFrame = CGRectMake( 430, 40*k-5, 35, 35 );
            button = [[UIButton alloc] initWithFrame: buttonFrame];
            [button setBackgroundImage:[UIImage imageNamed:@"email_send.png"] forState:UIControlStateNormal];
            [edetail addSubview: button];
            [button setTag:2000+k];
            [button addTarget:nil action:@selector(emailCert:) forControlEvents:UIControlEventTouchDown];
            
            
            labelFrame = CGRectMake( 470, 40*k, 50, 30 );
            label = [[UILabel alloc] initWithFrame: labelFrame];
            [label setText: @"Email"];
            [label setTextColor: [UIColor darkGrayColor]];
            [label setFont:[UIFont fontWithName:@"Helvetica" size:16]];
            [label setBackgroundColor:[edetail backgroundColor]];
            [edetail addSubview:label];
        }
    }
    
	//documents = [NSArray arrayWithObjects:@"http://mynote.net.au/telehealth/output/test.pdf", nil];
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"certviewsegue"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleCertViewController *destViewController = segue.destinationViewController;
        UIButton* btn = (UIButton*)sender;
        NSLog(@"%d",btn.tag);
        destViewController.reportId = [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag+1000]];
        destViewController.entryId = entry.eid;
        destViewController.reportType = [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag]];
        //NSLog(@"%d", type);
    }
    
}
-(IBAction)viewCert:(id)sender{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [self performSegueWithIdentifier:@"certviewsegue" sender:sender];
    //NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    //UIButton* btn = (UIButton*)sender;
    //NSURL *URL = [NSURL URLWithString:[NSString stringWithFormat:@"http://mynote.net.au/telehealth/index.php/redimed/getPdf/%@/%@/%@/%@", entry.eid, [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag]],[reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag+1000]],[defaults objectForKey:@"companyId"]]];
    /*
    QLPreviewController * preview = [[QLPreviewController alloc] init];
	preview.dataSource = self;
	preview.currentPreviewItemIndex = btn.tag - 1;
	[self presentModalViewController:preview animated:YES];
    [delegate hideActivityViewer];*/
    
}
-(NSData *)saveDocumentFileWithDocument:(NSString*)iURL withName:(NSString *)name
{
    NSData *data = [NSData dataWithContentsOfURL:[NSURL URLWithString:iURL] options:NSDataReadingUncached error:nil];
    
    NSArray       *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString  *documentsDirectory = [paths objectAtIndex:0];
    
    NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,name];
    
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
        
        NSString  *filePath = [NSString stringWithFormat:@"%@/%@", documentsDirectory,name];
        [urlData writeToFile:filePath atomically:YES];
        //return [NSData dataWithContentsOfFile:filePath];
        return urlData;
    }
    
    return nil;
}
- (IBAction)emailCert:(id)sender
{
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(0,0,1024,768)];
    [self performSelector:@selector(emailDefferred:) withObject:sender afterDelay:0.3];
}
-(void)emailDefferred:(id)sender{
    if ([MFMailComposeViewController canSendMail])
    {
        NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
        UIButton* btn = (UIButton*)sender;
        NSData* pdfData=nil;//[defaults objectForKey:[NSString stringWithFormat:@"%d", btn.tag]];
        if (nil==pdfData){
//            NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@",
//                                               entry.eid,
//                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag-1000]],
//                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag]],
//                                               [defaults objectForKey:@"companyId"]]
//                                relativeToURL:SITE_URL];
            NSURL *url = [NSURL URLWithString:[NSString stringWithFormat:@"json/getPdf/%@/%@/%@/%@/?token=%@",
                                               entry.eid,
                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag-1000]],
                                               [reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag]],
                                               [defaults objectForKey:@"companyId"],[defaults objectForKey:@"tokenUser"]]
                                relativeToURL:[rteleWebserviceManager getURL]];
            NSMutableURLRequest *requestA = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLRequestReloadIgnoringCacheData timeoutInterval:60];
            NSString *author_token = @"ec47bdd7fbbe04b395b20bd2922107f8";
            [requestA setValue:author_token forHTTPHeaderField:@"Authorization"];
            pdfData = [self saveDocumentFileWithDocument:[url absoluteString] withName:[NSString stringWithFormat:@"%@_%@.pdf",entry.eid,[reportTypes objectForKey:[NSString stringWithFormat:@"%d", btn.tag-1000]]]];
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
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
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


@end
