//
//  rteleSplitViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 2/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <QuartzCore/QuartzCore.h>
#import "rteleEntry.h"
#import "rteleEmployee.h"
#import <MessageUI/MessageUI.h>
#import <QuickLook/QuickLook.h>


@interface rteleSplitViewController : LandscapeOnlyUIViewController <UIWebViewDelegate,UIPopoverControllerDelegate, MFMailComposeViewControllerDelegate, QLPreviewControllerDataSource, QLPreviewControllerDelegate, UIDocumentInteractionControllerDelegate>{
    
    NSMutableArray *entries;
    NSMutableArray *filteredEntries;
    BOOL isFiltered;
    BOOL letUserSelectRow;
    NSIndexPath *selectedIndex;
    rteleEntry *entry;
    rteleEmployee *employee;
    NSString *employeeId;
}
@property CGFloat current_y;
@property (nonatomic) NSMutableArray *entries;
@property (nonatomic) NSMutableArray *reports;
@property (nonatomic) NSMutableArray *filteredEntries;
@property (weak, nonatomic) IBOutlet UISearchBar *searchBar;
@property (nonatomic, assign) BOOL isFiltered;
@property (nonatomic, retain) NSIndexPath *selectedIndex;
@property (nonatomic, retain) IBOutlet UITableView *tableview;
@property (nonatomic, retain) rteleEntry *entry;
@property (nonatomic, retain) rteleEmployee *employee;
@property (nonatomic, retain) NSString *employeeId;
@property (nonatomic, retain) NSMutableDictionary *salut;
@property (nonatomic, retain) NSMutableDictionary *active;
@property (nonatomic, retain) NSMutableDictionary *buttons;
@property (nonatomic, retain) NSMutableDictionary *panelHeight;
@property (nonatomic, retain) NSMutableDictionary *loading;
@property NSInteger maxIndex;
@property (nonatomic, retain) NSMutableDictionary *webviews;
@property (nonatomic, retain) NSMutableDictionary *webviewscontent;
@property (nonatomic, retain) NSMutableDictionary *webviewscontentheight;
@property (nonatomic, retain) IBOutlet UIScrollView *edetail;
@property (nonatomic, retain) IBOutlet UILabel *name;

@property (strong) UIPopoverController *popoverController;
@property (nonatomic, retain) UIButton * activebtn;

@property (nonatomic, retain) NSArray *documents;
-(IBAction)toggle:(id)sender;
-(IBAction)assessment:(id)sender;
@end
