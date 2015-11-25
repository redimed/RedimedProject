//
//  rteleHorizontalCollectionViewController.m
//  telehealth
//
//  Created by Olivier Voyer on 23/10/13.
//  Copyright (c) 2013 REDiMED. All rights reserved.
//

#import "rteleHorizontalCollectionViewController.h"

#import "rteleCollectionViewCell.h"

@interface rteleHorizontalCollectionViewController ()

@end

@implementation rteleHorizontalCollectionViewController

@synthesize contentArray;
@synthesize selectArray;

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
    // Do any additional setup after loading the view from its nib.
    [self.collectionView setAllowsMultipleSelection:YES];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (NSInteger)numberOfSectionsInCollectionView:(UICollectionView *)collectionView {
    // Return the number of sections.
    return 1;
}

- (NSInteger)collectionView:(UICollectionView *)collectionView numberOfItemsInSection:(NSInteger)section {
    return [contentArray count];
}

- (UICollectionViewCell *)collectionView:(UICollectionView *)collectionView cellForItemAtIndexPath:(NSIndexPath *)indexPath {
    static NSString *CellIdentifier = @"rteleCollectionViewCell";
    rteleCollectionViewCell *cell = [collectionView dequeueReusableCellWithReuseIdentifier:CellIdentifier forIndexPath:indexPath];
	if (cell == nil) {
		cell = [[rteleCollectionViewCell alloc] init];
	}
    
    
    
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPhone) {
        UILabel *title = [[UILabel alloc] initWithFrame:cell.bounds];
        [title setText:[contentArray objectAtIndex:indexPath.row]];
        [title setFont:[UIFont systemFontOfSize:9.0]];
        [cell addSubview:title];
        [cell.textLabel setText:@""];
    }else{
        cell.textLabel.text = [contentArray objectAtIndex:indexPath.row];
    }
    
    if ([[selectArray objectAtIndex:indexPath.row] isEqualToString:@"yes"]) {
        [collectionView selectItemAtIndexPath:indexPath animated:NO scrollPosition:UICollectionViewScrollPositionNone];
        [cell setSelected:YES];
    }
    return cell;
}

- (CGFloat)heightForTweetCellWithString:(NSString *)text {
    CGSize maximumSize = CGSizeMake(300, 9999);
    CGFloat height = 0.0;
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        height = 20+[text sizeWithFont:[UIFont fontWithName:@"Helvetica" size:15.0f] constrainedToSize:maximumSize
                         lineBreakMode:NSLineBreakByWordWrapping].width;
    }else{
        height = [text sizeWithFont:[UIFont fontWithName:@"Helvetica" size:10.5f] constrainedToSize:maximumSize
                         lineBreakMode:NSLineBreakByWordWrapping].width;
    }
    NSLog(@"height-%f",height);
    return ceilf(height);
}

- (CGSize)collectionView:(UICollectionView *)collectionView layout:(UICollectionViewLayout*)collectionViewLayout sizeForItemAtIndexPath:(NSIndexPath *)indexPath {
    NSString *text = [contentArray objectAtIndex:indexPath.row];
    
    return CGSizeMake([self heightForTweetCellWithString:text], collectionView.frame.size.height);
}

-(void)collectionView:(UICollectionView *)collectionView didSelectItemAtIndexPath:(NSIndexPath *)indexPath{
    NSLog(@"\n %s \n",__func__);
}
@end
