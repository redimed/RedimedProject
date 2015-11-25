//
//  rteleRedFlagsViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 1/10/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleRedFlagsViewController : LandscapeOnlyUITableViewController {
    NSDictionary *entries;
}
@property (nonatomic) NSDictionary *entries;
@property (nonatomic) IBOutlet UITableView *tbv;
-(void)initWithData:(NSDictionary*)data;
@end
