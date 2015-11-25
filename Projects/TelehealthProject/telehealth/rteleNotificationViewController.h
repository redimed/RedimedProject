//
//  rteleNotificationViewController.h
//  telehealth
//
//  Created by Khoa Nguyen on 27/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleNotificationViewController : LandscapeOnlyUICollectionViewController {
    
    NSMutableArray *entries;
    NSIndexPath *selectedIndex;
}
@property (nonatomic) NSMutableArray *entries;
@property (nonatomic, retain) NSIndexPath *selectedIndex;
@property (nonatomic, retain) IBOutlet UICollectionView *CV;

@end
