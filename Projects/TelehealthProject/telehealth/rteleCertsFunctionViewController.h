//
//  rteleCertsFunctionViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 25/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

#import <QuartzCore/QuartzCore.h>
#import "rteleEntry.h"
#import "rteleEmployee.h"
#import <MessageUI/MessageUI.h>
#import <QuickLook/QuickLook.h>

@interface rteleCertsFunctionViewController : LandscapeOnlyUIViewController <UITextFieldDelegate, UIWebViewDelegate, MFMailComposeViewControllerDelegate, QLPreviewControllerDataSource, QLPreviewControllerDelegate, UIDocumentInteractionControllerDelegate>{
    NSMutableArray *reports;
    rteleEntry *entry;
    rteleEmployee *employee;
    NSString *employeeId;
    NSArray * documents;
}
@property (nonatomic, retain) rteleEntry *entry;
@property (nonatomic, retain) rteleEmployee *employee;
@property (nonatomic, retain) NSString *employeeId;
@property (nonatomic, retain) NSMutableArray *reports;
@property (nonatomic, retain) NSMutableDictionary *reportTypes;
@property (nonatomic, retain) NSArray *documents;

@property (nonatomic, retain) IBOutlet UIScrollView *edetail;
-(IBAction)viewCert:(id)sender;
-(IBAction)emailCert:(id)sender;
@end
