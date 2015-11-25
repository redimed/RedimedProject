//
//  rteleCertViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 26/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleCertViewController : LandscapeOnlyUIViewController <UIWebViewDelegate>{
    NSString *reportId;
    NSString *entryId;
    NSString *reportType;
}
@property (nonatomic, retain) NSString *reportId;
@property (nonatomic, retain) NSString *entryId;
@property (nonatomic, retain) NSString *reportType;
@property (nonatomic, retain) IBOutlet UIWebView *edetail;

@end
