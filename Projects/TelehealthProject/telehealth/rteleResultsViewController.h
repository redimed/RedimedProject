//
//  rteleResultsViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleResultsViewController : LandscapeOnlyUITableViewController {
    
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

@end
