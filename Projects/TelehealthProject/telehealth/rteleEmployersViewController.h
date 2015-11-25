//
//  rteleEmployersViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 26/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleEmployersViewController : LandscapeOnlyUITableViewController {
    
    NSMutableArray *entries;
    NSMutableArray *filteredEntries;
    BOOL isFiltered;
    BOOL letUserSelectRow;
    NSIndexPath *selectedIndex;
}
@property (nonatomic) NSMutableArray *entries;
@property (nonatomic) NSMutableArray *filteredEntries;
@property (weak, nonatomic) IBOutlet UISearchBar *searchBar;
@property (nonatomic, assign) BOOL isFiltered;
@property (nonatomic, retain) NSIndexPath *selectedIndex;

@property (nonatomic, retain) IBOutlet UITableView *tableview;

@end
