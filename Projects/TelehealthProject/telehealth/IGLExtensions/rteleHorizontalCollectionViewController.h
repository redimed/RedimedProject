//
//  rteleHorizontalCollectionViewController.h
//  telehealth
//
//  Created by Olivier Voyer on 23/10/13.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface rteleHorizontalCollectionViewController : UICollectionViewController <UICollectionViewDataSource, UICollectionViewDelegate> {
    UICollectionView *horizontalCollectionView;
    
    NSArray *contentArray;
    NSMutableArray *selectArray;
}

@property (nonatomic, retain) NSArray *contentArray;
@property (nonatomic, retain) NSMutableArray *selectArray;

@end
