//
//  TopVCOrientationNavigationController.m
//  telehealth
//
//  Created by Olivier Voyer on 17/10/13.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import "TopVCOrientationNavigationController.h"

@interface TopVCOrientationNavigationController ()

@end

@implementation TopVCOrientationNavigationController

- (BOOL)shouldAutorotate
{
    return self.topViewController.shouldAutorotate; // you are asking your current controller what it should do
}

- (NSUInteger)supportedInterfaceOrientations {
    return self.topViewController.supportedInterfaceOrientations; // you are asking your current controller what it should do
}

@end

@implementation LandscapeOnlyUIViewController

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscape;
}

@end

@implementation LandscapeOnlyUITableViewController

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscape;
}

- (UITableViewCellEditingStyle)tableView:(UITableView *)aTableView editingStyleForRowAtIndexPath:(NSIndexPath *)indexPath {
    // Detemine if it's in editing mode
    if (self.tableView.editing) {
        return UITableViewCellEditingStyleDelete;
    }
    return UITableViewCellEditingStyleNone;
}

@end

@implementation LandscapeOnlyUICollectionViewController

- (NSUInteger)supportedInterfaceOrientations {
    return UIInterfaceOrientationMaskLandscape;
}

@end
